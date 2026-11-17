import { Sparkles, ArrowRight, Star, Plus } from "lucide-react";
import type { Product } from "../data/products";
import ProductPhoto from "./ProductPhoto";
import { money } from "../utils/money";
import type { ProductAction } from "../types/store";
interface ProductCardProps {
  product: Product;
  onSelect: ProductAction;
  onAdd: ProductAction;
}

export default function ProductCard({
  product,
  onSelect,
  onAdd,
}: ProductCardProps) {
  return (
    <article className="product-card">
      <button
        className={`product-image ${product.color}`}
        onClick={() => onSelect(product)}
        aria-label={`View ${product.name}`}
      >
        {product.badge && (
          <span
            className={`badge ${product.badge === "Bestseller" ? "badge-dark" : ""}`}
          >
            {product.badge === "Bestseller" && <Sparkles size={11} />}{" "}
            {product.badge}
          </span>
        )}
        <ProductPhoto product={product} />
        <span className="quick-view">
          Take a closer look <ArrowRight size={14} />
        </span>
      </button>
      <div className="product-info">
        <div className="product-brand">
          {product.brand}
          <span>
            <Star size={12} fill="currentColor" /> {product.rating}{" "}
            <i>({product.reviews})</i>
          </span>
        </div>
        <button className="product-title" onClick={() => onSelect(product)}>
          {product.name}
        </button>
        <p>{product.specs}</p>
        <div className="price-row">
          <div>
            <strong>{money(product.price)}</strong>
            {product.previousPrice && <del>{money(product.previousPrice)}</del>}
          </div>
          <button
            className="add-button"
            disabled={product.stock === 0}
            onClick={() => onAdd(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={19} />
          </button>
        </div>
      </div>
    </article>
  );
}
