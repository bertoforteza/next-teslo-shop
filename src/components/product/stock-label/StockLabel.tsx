"use client";

import { getStockBySlug } from "@/actions";
import { titleFont } from "@/config/fonts";
import { useEffect, useState } from "react";

interface StockLabelProps {
  slug: string;
}

export const StockLabel: React.FC<StockLabelProps> = ({ slug }) => {
  const [stockValue, setStockValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const getStock = async () => {
      try {
        const stock = await getStockBySlug(slug);

        if (isMounted) {
          setStockValue(stock);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getStock();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <>
      {isLoading ? (
        <h1
          className={`${titleFont.className} antialiased font-bold text-lg bg-gray-200 animate-pulse`}
        >
          &nbsp;
          {/* código de un espacio vacío */}
        </h1>
      ) : (
        <h1 className={`${titleFont.className} antialiased font-bold text-lg`}>
          Stock: {isLoading ? "Cargando..." : stockValue}
        </h1>
      )}
    </>
  );
};
