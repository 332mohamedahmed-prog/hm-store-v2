"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getCart, getCartCount, getCartTotal, type CartItem } from "@/lib/cart";

interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  refresh: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  total: 0,
  refresh: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  const refresh = useCallback(() => {
    const cart = getCart();
    setItems(cart);
    setCount(getCartCount(cart));
    setTotal(getCartTotal(cart));
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("cart-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("cart-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return (
    <CartContext.Provider value={{ items, count, total, refresh }}>
      {children}
    </CartContext.Provider>
  );
}
