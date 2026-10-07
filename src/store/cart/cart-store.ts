import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];
  getTotalItems: () => number;
  getSummaryInformation: () => {
    subTotal: number;
    tax: number;
    total: number;
    intemsInCart: number;
  };
  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct) => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      getTotalItems: () => {
        const { cart } = get();

        return cart.reduce((total, item) => total + item.quantity, 0);
      },

      getSummaryInformation: () => {
        const { cart } = get();

        const subTotal = cart.reduce(
          (subTotal, product) => product.quantity * product.price + subTotal,
          0,
        );
        const tax = subTotal * 0.15;
        const total = subTotal + tax;
        const intemsInCart = cart.reduce(
          (total, item) => total + item.quantity,
          0,
        );

        return {
          subTotal,
          tax,
          total,
          intemsInCart,
        };
      },

      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        // 1. revisar si el producto ya existe con la talla seleccionada
        const isProductInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size,
        );

        if (!isProductInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        // 2. Sabemos que el producto existe con la misma talla, hay que cambiar la cantidad
        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity };
          }

          return item;
        });

        set({ cart: updatedCartProducts });
      },

      updateProductQuantity: (product, quantity) => {
        const { cart } = get();
        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity };
          }

          return item;
        });

        set({ cart: updatedCartProducts });
      },

      removeProduct: (product) => {
        const { cart } = get();
        const updatedCartProducts = cart.filter(
          (item) => item.id !== product.id || item.size !== product.size,
        );

        set({ cart: updatedCartProducts });
      },
    }),
    { name: "shopping-cart" },
  ),
);
