import { useEffect, useRef, useState } from "react";
import type { Product } from "../data/products";
import type { Cart } from "../types/store";
import { api } from "../data/api";

export function useCart(products: Product[]) {
  const [cart, setCart] = useState<Cart>({});
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const current = useRef<Cart>({});
  const locked = useRef(false);
  const initialRequest = useRef<Promise<Cart> | null>(null);
  function update(next: Cart) {
    current.current = next;
    setCart(next);
  }
  async function load() {
    setError("");
    try {
      update(await api<Cart>("/cart"));
      setReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load cart");
    }
  }
  useEffect(() => {
    // Reuse the request across StrictMode effect replays: one guest cookie.
    initialRequest.current ??= api<Cart>("/cart");
    let active = true;
    initialRequest.current
      .then((next) => {
        if (active) {
          update(next);
          setReady(true);
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, []);
  async function setQuantity(id: string, quantity: number) {
    if (!ready) {
      setError("Load your cart before adding products.");
      return false;
    }
    if (locked.current) return false;
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      await api(`/cart/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      });
      const next = { ...current.current };
      if (quantity === 0) delete next[id];
      else next[id] = quantity;
      update(next);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update cart");
      return false;
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  const items = products.filter((p) => cart[p.id]);
  const count = Object.values(cart).reduce((sum, n) => sum + n, 0);
  const total = items.reduce((sum, p) => sum + p.price * cart[p.id], 0);
  return {
    cart,
    items,
    count,
    total,
    error,
    ready,
    busy,
    reload: load,
    add: (p: Product) =>
      setQuantity(p.id, Math.min((current.current[p.id] || 0) + 1, 99)),
    changeQuantity: (id: string, delta: number) =>
      setQuantity(
        id,
        Math.max(0, Math.min(99, (current.current[id] || 0) + delta)),
      ),
    remove: (id: string) => setQuantity(id, 0),
    clear: () => update({}),
  };
}
