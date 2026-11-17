import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { api } from "../data/api";
import { money } from "../utils/money";

export default function Checkout({
  total,
  onOrdered,
}: {
  total: number;
  onOrdered: () => void;
}) {
  const requestId = useRef(crypto.randomUUID());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<{ id: string; total: number } | null>(
    null,
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const fields = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const result = await api<{ id: string; total: number }>("/orders", {
        method: "POST",
        body: JSON.stringify({
          name: fields.get("name"),
          email: fields.get("email"),
          address: fields.get("address"),
          requestId: requestId.current,
        }),
      });
      setOrder(result);
      onOrdered();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to place order");
    } finally {
      setBusy(false);
    }
  }
  if (order)
    return (
      <div className="checkout-form" role="status">
        <h3>Thank you for your order!</h3>
        <p>
          Order reference: <strong>{order.id}</strong>
        </p>
        <p>Total: {money(order.total)}</p>
        <p>Your order has been saved. No payment has been taken.</p>
      </div>
    );
  return (
    <form className="checkout-form" onSubmit={submit}>
      <h3>Delivery details</h3>
      <label>
        Full name
        <input
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={120}
          disabled={busy}
        />
      </label>
      <label>
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          disabled={busy}
        />
      </label>
      <label>
        Delivery address
        <textarea
          name="address"
          autoComplete="street-address"
          required
          minLength={8}
          maxLength={500}
          disabled={busy}
        />
      </label>
      <p>
        Total including delivery:{" "}
        <strong>{money(total + (total >= 100 ? 0 : 9.9))}</strong>
      </p>
      <small>
        We will save your order and delivery details. No online payment is
        collected.
      </small>
      {error && <p role="alert">{error}</p>}
      <button className="button primary checkout-button" disabled={busy}>
        {busy ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}
