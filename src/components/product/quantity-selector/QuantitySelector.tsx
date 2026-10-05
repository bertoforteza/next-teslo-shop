"use client";

import { useState } from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface QuantitySelectorProps {
  quantity: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
}) => {
  const [count, setCount] = useState<number>(quantity);

  const onQuantityChanged = (value: number) => {
    if (count + value < 1) return;

    setCount(count + value);
  };

  return (
    <div className="flex items-center">
      <button onClick={() => onQuantityChanged(-1)}>
        <IoRemoveCircleOutline size={30} />
      </button>

      <span className="w-20 mx-20 px-5 bg-gray-100 text-center rounded">
        {count}
      </span>

      <button onClick={() => onQuantityChanged(1)}>
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  );
};
