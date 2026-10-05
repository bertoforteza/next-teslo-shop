import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { IoCardOutline } from "react-icons/io5";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm_px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Pedido #${id}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <div
              className={clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  "bg-red-500": true,
                  "bg-green-700": false,
                },
              )}
            >
              <IoCardOutline size={30} />
              <span className="mx-2">Pendiente de pago</span>
              <span className="mx-2">Pedido pagado</span>
            </div>

            {productsInCart.map((product) => (
              <div key={product.slug} className="flex mb-5">
                <Image
                  src={`/products/${product.images[0]}`}
                  width={100}
                  height={100}
                  style={{ width: "100px", height: "100px" }}
                  alt={product.title}
                  className="mr-5 rounded"
                />

                <div>
                  <p>{product.title}</p>
                  <p>${product.price} x 3</p>
                  <p className="font-bold">Subtotal: ${product.price * 3}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="font-bold text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">Berto Forteza</p>
              <p>C. Merlera, 15</p>
              <p>Palma, Baleares</p>
              <p>CP 07013</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen del pedido</h2>

            <div className="grid grid-cols-2">
              <span>Nº productos</span>
              <span className="text-right">3 artículos</span>

              <span>Subtotal</span>
              <span className="text-right">$ 100</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">$ 15</span>

              <span className="text-2xl mt-5">Total:</span>
              <span className="text-2xl mt-5 text-right">$ 100</span>
            </div>

            <div className="mt-5 mb-2 w-full">
              <div
                className={clsx(
                  "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                  {
                    "bg-red-500": true,
                    "bg-green-700": false,
                  },
                )}
              >
                <IoCardOutline size={30} />
                <span className="mx-2">Pendiente de pago</span>
                <span className="mx-2">Pedido pagado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
