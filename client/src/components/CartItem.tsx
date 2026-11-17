import { Minus, Plus } from "lucide-react";
import type { Product } from "../data/products";
import ProductArt from "./ProductArt";
import { money } from "../utils/money";

interface CartItemProps {
  product: Product;
  quantity: number;
  onQuantityChange: (id: string, difference: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({
  product,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  return (
    <div className="cart-item">
      <div className={`cart-art ${product.color}`}>
        <ProductArt kind={product.kind} id={`cart-${product.id}`} />
      </div>
      <div className="cart-item-content">
        <strong>{product.name}</strong>
        <small>{money(product.price)} each</small>
        <div className="quantity-controls">
          <button
            aria-label={`Decrease ${product.name} quantity`}
            onClick={() => onQuantityChange(product.id, -1)}
          >
            <Minus size={14} />
          </button>
          <span>{quantity}</span>
          <button
            aria-label={`Increase ${product.name} quantity`}
            disabled={quantity >= 99}
            onClick={() => onQuantityChange(product.id, 1)}
          >
            <Plus size={14} />
          </button>
          <button className="remove-item" onClick={() => onRemove(product.id)}>
            Remove
          </button>
        </div>
      </div>
      <strong>{money(product.price * quantity)}</strong>
    </div>
  );
}
