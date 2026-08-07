"use client";

import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { convertPrice, type Currency, type FxRates } from "@/lib/currency";

export type CartItem = {
  id: string;
  title: string;
  artist: string;
  price: number;
  currency: Currency;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  displayCurrency: Currency;
  setDisplayCurrency: (currency: Currency) => void;
  rates: FxRates | null;
  convertToDisplay: (amount: number, from: Currency) => number;
  totalInDisplayCurrency: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [displayCurrency, setDisplayCurrency] = useState<Currency>("KRW");
  const [rates, setRates] = useState<FxRates | null>(null);

  useEffect(() => {
    fetch("/api/fx-rates")
      .then((r) => r.json())
      .then((data) => setRates(data.rates))
      .catch(() => setRates(null));
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const convertToDisplay = useCallback(
    (amount: number, from: Currency) => {
      if (from === displayCurrency) return amount;
      if (!rates) return amount; // rates still loading — show native amount rather than block
      return convertPrice(amount, from, displayCurrency, rates);
    },
    [displayCurrency, rates]
  );

  const totalInDisplayCurrency = useMemo(
    () => items.reduce((sum, i) => sum + convertToDisplay(i.price, i.currency) * i.quantity, 0),
    [items, convertToDisplay]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        displayCurrency,
        setDisplayCurrency,
        rates,
        convertToDisplay,
        totalInDisplayCurrency,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
