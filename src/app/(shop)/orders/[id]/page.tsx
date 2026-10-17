import { getOderById } from "@/actions";
import { Title } from "@/components";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;

  const { order, ok } = await getOderById(id);

  if (!ok) {
    redirect("/");
  }

  const address = order?.orderAddress;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm_px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Pedido #${id.split("-").at(-1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <div
              className={clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  "bg-red-500": !order?.isPaid,
                  "bg-green-700": order?.isPaid,
                },
              )}
            >
              <IoCardOutline size={30} />

              <span className="mx-2">
                {order?.isPaid ? "Pedido pagado" : "Pendiente de pago"}
              </span>
            </div>

            {order?.orderItems.map((item) => (
              <div
                key={item.product.slug + "-" + item.size}
                className="flex mb-5"
              >
                <Image
                  src={`/products/${item.product.productImages[0].url}`}
                  width={100}
                  height={100}
                  style={{ width: "100px", height: "100px" }}
                  alt={item.product.title}
                  className="mr-5 rounded"
                />

                <div>
                  <p>{item.product.title}</p>
                  <p>
                    ${item.price} x {item.quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal: {currencyFormat(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="font-bold text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">
                {address?.firstName} {address?.lastName}
              </p>
              <p>{address?.address}</p>
              <p>{address?.address2}</p>
              <p>{address?.postalCode}</p>
              <p>
                {address?.city}, {address?.countryId}
              </p>
              <p>{address?.phone}</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen del pedido</h2>

            <div className="grid grid-cols-2">
              <span>Nº productos</span>
              <span className="text-right">
                {order?.itemsInOrder === 1
                  ? "1 artículo"
                  : `${order?.itemsInOrder} artículos`}
              </span>

              <span>Subtotal</span>
              <span className="text-right">
                {currencyFormat(order?.subTotal ?? 0)}
              </span>

              <span>Impuestos (15%)</span>
              <span className="text-right">
                {currencyFormat(order?.tax ?? 0)}
              </span>

              <span className="text-2xl mt-5">Total:</span>
              <span className="text-2xl mt-5 text-right">
                {currencyFormat(order?.total ?? 0)}
              </span>
            </div>

            <div className="mt-5 mb-2 w-full">
              <div
                className={clsx(
                  "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                  {
                    "bg-red-500": !order?.isPaid,
                    "bg-green-700": order?.isPaid,
                  },
                )}
              >
                <IoCardOutline size={30} />

                <span className="mx-2">
                  {order?.isPaid ? "Pedido pagado" : "Pendiente de pago"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
