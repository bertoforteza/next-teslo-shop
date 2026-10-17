"use client";

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { useShallow } from "zustand/shallow";

export const PlaceOrder = () => {
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const loaded = useSyncExternalStore(
    (onStoreChange) => {
      const unsubscribeCart =
        useCartStore.persist.onFinishHydration(onStoreChange);
      const unsubscribeAddress =
        useAddressStore.persist.onFinishHydration(onStoreChange);

      return () => {
        unsubscribeCart();
        unsubscribeAddress();
      };
    },
    () =>
      useCartStore.persist.hasHydrated() &&
      useAddressStore.persist.hasHydrated(),
    () => false,
  );

  const address = useAddressStore((state) => state.address);

  const { intemsInCart, subTotal, tax, total } = useCartStore(
    useShallow((state) => state.getSummaryInformation()),
  );
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);
    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    const response = await placeOrder(productsToOrder, address);
    if (!response.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(response.message ?? "");
      return;
    }

    clearCart();
    router.replace("/orders/" + response.order?.id);
  };

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="font-bold text-2xl mb-2">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Resumen del pedido</h2>

      <div className="grid grid-cols-2">
        <span>Nº productos</span>
        <span className="text-right">
          {intemsInCart === 1 ? "1 artículo" : `${intemsInCart} artículos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="text-2xl mt-5">Total:</span>
        <span className="text-2xl mt-5 text-right">
          {currencyFormat(total)}
        </span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          <span>
            {`Al hacer click en "Tramitar pedido", aceptas nuestros `}
            <a href="#" className="underline">
              términos y condiciones
            </a>{" "}
            y{" "}
            <a href="#" className="underline">
              política de privacidad
            </a>
          </span>
        </p>

        <p className="text-red-500">{errorMessage}</p>

        <button
          // href={"/orders/123"}
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
          onClick={onPlaceOrder}
        >
          Tramitar pedido
        </button>
      </div>
    </div>
  );
};
