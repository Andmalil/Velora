import { useState } from "react";
import { Truck, ShoppingBag, ArrowRight } from "lucide-react";
import type { Product } from "../data/products";
import type { Cart } from "../types/store";
import { money } from "../utils/money";
import Modal from "./Modal";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyState from "./EmptyState";
import Checkout from "./Checkout";
interface CartModalProps {
  cart: Cart;
  products: Product[];
  count: number;
  total: number;
  onClose: () => void;
  onBrowse: () => void;
  onQuantityChange: (id: string, difference: number) => void;
  onRemove: (id: string) => void;
  onOrdered: () => void;
  busy: boolean;
  error: string;
}

export default function CartModal({
  cart,
  products,
  count,
  total,
  onClose,
  onBrowse,
  onQuantityChange,
  onRemove,
  onOrdered,
  busy,
  error,
}: CartModalProps) {
  const [checkout, setCheckout] = useState(false);
  return (
    <Modal
      title={`Your cart (${count})`}
      className="cart-modal"
      onClose={onClose}
    >
      {error && (
        <p role="alert" className="service-notice">
          {error}
        </p>
      )}
      {checkout ? (
        <Checkout total={total} onOrdered={onOrdered} />
      ) : products.length ? (
        <>
          <div className="shipping-note">
            <Truck size={18} />
            {total >= 100
              ? "Your order qualifies for free shipping."
              : `You’re ${money(100 - total)} away from free shipping.`}
          </div>
          <fieldset className="cart-items cart-fieldset" disabled={busy}>
            {products.map((product) => (
              <CartItem
                key={product.id}
                product={product}
                quantity={cart[product.id]}
                onQuantityChange={onQuantityChange}
                onRemove={onRemove}
              />
            ))}
          </fieldset>
          <CartSummary
            total={total}
            checkout={checkout}
            onCheckout={() => setCheckout(true)}
            disabled={busy}
          />
        </>
      ) : (
        <EmptyState
          icon={<ShoppingBag size={42} />}
          title="Your next upgrade is waiting."
          description="Find something you love and add it to your cart."
        >
          <button className="button primary" onClick={onBrowse}>
            Explore products <ArrowRight size={16} />
          </button>
        </EmptyState>
      )}
    </Modal>
  );
}
