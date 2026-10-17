"use server";

import { auth } from "@/auth.config";
import { Address, Size } from "@/interfaces";
import { prisma } from "@/lib/prisma";
import { unknown } from "zod";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address,
) => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) {
    return { ok: false, message: "No hay sesión de usuario" };
  }

  // Nota: podemos llevar varios productos con el mismo ID
  const products = await prisma.product.findMany({
    where: { id: { in: productIds.map((p) => p.productId) } },
  });

  const itemsInOrder = productIds.reduce(
    (count, product) => count + product.quantity,
    0,
  );

  const { subTotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((product) => product.id === item.productId);

      if (!product) throw new Error(`${item.productId} no existe - 500`);

      const subTotal = product.price * productQuantity;

      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 },
  );

  // Crear la transacción de base de datos
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos
      const updatedProductsPromises = products.map(async (product) => {
        // Acumular los valores
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id}, no tiene cantidad definida`);
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            // inStock: product.inStock - productQuantity, // no hacer
            inStock: { decrement: productQuantity },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);
      // Verificar valores negativos en las existencias = no hay stock
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} no tiene stock suficiente`);
        }
      });

      // 2. Crear la orden - Encabezado - Detalles
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subTotal,
          tax,
          total,
          orderItems: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price:
                  products.find((product) => product.id === p.productId)
                    ?.price ?? 0,
              })),
            },
          },
        },
      });

      // 3. Crear la dirección de la orden
      const { country, ...restAddress } = address;
      const orderAddress = await tx.orderAddress.create({
        data: { ...restAddress, countryId: country, orderId: order.id },
      });

      return { order, updatedProducts, orderAddress };
    });

    return { ok: true, order: prismaTx.order, prismaTx };
  } catch (error) {
    return {
      ok: false,
      message: (error as unknown as { message: string })?.message,
    };
  }
};
