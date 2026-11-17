import type { Ref } from "react";
import { Check, ArrowDown, Search } from "lucide-react";
import type { Category, Product } from "../data/products";
import type { Browse, ProductAction } from "../types/store";
import CategoryTabs from "./CategoryTabs";
import CatalogToolbar from "./CatalogToolbar";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";
interface CatalogProps {
  catalogRef: Ref<HTMLElement>;
  category: Category;
  onCategoryChange: (value: Category) => void;
  query: string;
  onQueryChange: (value: string) => void;
  dealsOnly: boolean;
  onDealsChange: (value: boolean) => void;
  sort: string;
  onSortChange: (value: string) => void;
  products: Product[];
  browse: Browse;
  onSelect: ProductAction;
  onAdd: ProductAction;
}

export default function Catalog({
  catalogRef,
  category,
  onCategoryChange,
  query,
  onQueryChange,
  dealsOnly,
  onDealsChange,
  sort,
  onSortChange,
  products,
  browse,
  onSelect,
  onAdd,
}: CatalogProps) {
  return (
    <section className="catalog" ref={catalogRef} id="shop">
      <CategoryTabs category={category} onChange={onCategoryChange} />
      <CatalogToolbar
        query={query}
        onQueryChange={onQueryChange}
        dealsOnly={dealsOnly}
        onDealsChange={onDealsChange}
        count={products.length}
        sort={sort}
        onSortChange={onSortChange}
      />
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelect}
            onAdd={onAdd}
          />
        ))}
      </div>
      {products.length === 0 && (
        <EmptyState
          icon={<Search size={32} />}
          title="No products found"
          description="Try another search or explore all our products."
        >
          <button className="button primary" onClick={() => browse()}>
            Reset filters
          </button>
        </EmptyState>
      )}
      <div className="catalog-bottom">
        <span>
          <Check size={14} /> Good tech. Fair prices. No compromises.
        </span>
        <a href="#shop">
          Back to top <ArrowDown className="up-arrow" size={15} />
        </a>
      </div>
    </section>
  );
}
