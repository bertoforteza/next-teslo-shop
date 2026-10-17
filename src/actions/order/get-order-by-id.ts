"use server";

import { auth } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export const getOderById = async (id: string) => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: "Debe de estar autenticado",
    };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderAddress: true,
        orderItems: {
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,

                productImages: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw `${id} no existe`;

    if (session.user.role === "user") {
      if (session.user.id !== order.userId) {
        throw `${id} no es de este usuario`;
      }
    }

    return {
      ok: true,
      order,
    };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Pedido no existe" };
  }
};
