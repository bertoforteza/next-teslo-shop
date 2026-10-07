"use client";

import { useIsClient } from "@/hooks/useIsClient";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useShallow } from "zustand/shallow";

export const OrderSummary = () => {
  const { intemsInCart, subTotal, tax, total } = useCartStore(
    useShallow((state) => state.getSummaryInformation()),
  );

  const isClient = useIsClient();
  if (!isClient) return <p>Loading...</p>;

  return (
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
      <span className="text-2xl mt-5 text-right">{currencyFormat(total)}</span>
    </div>
  );
};
