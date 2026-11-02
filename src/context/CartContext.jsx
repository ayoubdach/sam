import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "samart_gallery_cart";

const CartContext = createContext(null);

/** Unique key per variant: the same piece in another size/frame is a separate line. */
export const makeCartKey = (id, size, frame) => `${id}-${size}-${frame}`;

const loadCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i) =>
        i &&
        typeof i.key === "string" &&
        typeof i.unitPrice === "number" &&
        typeof i.quantity === "number" &&
        i.quantity > 0
    );
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);

  // Persist on every change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage may be unavailable (private mode) – fail silently */
    }
  }, [items]);

  // Keep several tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setItems(loadCart());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /**
   * item: { id, reference, name, image, size, frame, sizeLabel, frameLabel, unitPrice, quantity? }
   */
  const addToCart = useCallback((item) => {
    const key = makeCartKey(item.id, item.size, item.frame);
    const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...item, key, quantity: qty }];
    });
    setLastAdded({ ...item, key, stamp: Date.now() });
  }, []);

  const removeFromCart = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  /** delta = +1 / -1. A quantity that reaches 0 removes the line. */
  const updateQuantity = useCallback((key, delta) => {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.key !== key) return [i];
        const next = i.quantity + delta;
        return next <= 0 ? [] : [{ ...i, quantity: next }];
      })
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const dismissToast = useCallback(() => setLastAdded(null), []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items]
  );
  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      subtotal,
      itemCount,
      isOpen,
      lastAdded,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      dismissToast,
    }),
    [
      items,
      subtotal,
      itemCount,
      isOpen,
      lastAdded,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      dismissToast,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
