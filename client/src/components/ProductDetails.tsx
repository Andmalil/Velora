import { Star, ShoppingBag } from "lucide-react";
import type { Product } from "../data/products";
import ProductPhoto from "./ProductPhoto";
import { money } from "../utils/money";
import type { ProductAction } from "../types/store";
import Modal from "./Modal";
interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  onAdd: ProductAction;
}

export default function ProductDetails({
  product,
  onClose,
  onAdd,
}: ProductDetailsProps) {
  return (
    <Modal title="A closer look" onClose={() => onClose()}>
      <div className={`detail-art ${product.color}`}>
        <ProductPhoto product={product} />
      </div>
      <div className="detail-content">
        <span className="eyebrow">
          {product.brand} / {product.category}
        </span>
        <h2>{product.name}</h2>
        <div className="detail-rating">
          <Star size={16} fill="currentColor" /> {product.rating}{" "}
          <span>({product.reviews} sample reviews)</span>
        </div>
        <p>{product.description}</p>
        <div className="spec-box">{product.specs}</div>
        <div className="detail-bottom">
          <strong>{money(product.price)}</strong>
          <button
            className="button primary"
            disabled={product.stock === 0}
            onClick={() => onAdd(product)}
          >
            {product.stock === 0 ? "Out of stock" : "Add to cart"}{" "}
            <ShoppingBag size={17} />
          </button>
        </div>
        <small className="demo-note">
          Sample product and pricing for demonstration.
        </small>
      </div>
    </Modal>
  );
}
