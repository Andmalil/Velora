import { ArrowRight } from "lucide-react";
import { money } from "../utils/money";
interface CartSummaryProps {
  total: number;
  checkout: boolean;
  onCheckout: () => void;
  disabled?: boolean;
}

export default function CartSummary({
  total,
  onCheckout,
  disabled,
}: CartSummaryProps) {
  return (
    <div className="cart-summary">
      <div>
        <span>Subtotal</span>
        <strong>{money(total)}</strong>
      </div>
      <div>
        <span>Shipping</span>
        <span>{total >= 100 ? "Free" : money(9.9)}</span>
      </div>
      <small>
        Order total: {money(total + (total >= 100 ? 0 : 9.9))}. No online
        payment required.
      </small>
      <button
        className="button primary checkout-button"
        onClick={() => onCheckout()}
        disabled={disabled}
      >
        Continue to checkout <ArrowRight size={17} />
      </button>
    </div>
  );
}
