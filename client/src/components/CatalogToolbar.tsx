import { Search, ChevronDown } from "lucide-react";

interface CatalogToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  dealsOnly: boolean;
  onDealsChange: (value: boolean) => void;
  count: number;
  sort: string;
  onSortChange: (sort: string) => void;
}

export default function CatalogToolbar({
  query,
  onQueryChange,
  dealsOnly,
  onDealsChange,
  count,
  sort,
  onSortChange,
}: CatalogToolbarProps) {
  return (
    <div className="catalog-toolbar">
      <div className="search-field">
        <Search size={18} />
        <input
          id="search"
          type="search"
          placeholder="Search your next upgrade..."
          aria-label="Search products"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
      <label className="deal-filter">
        <input
          type="checkbox"
          checked={dealsOnly}
          onChange={(e) => onDealsChange(e.target.checked)}
        />{" "}
        Deals only
      </label>
      <span className="product-count">{count} products</span>
      <label className="sort-field">
        <span>Sort by:</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort products"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
        <ChevronDown size={14} />
      </label>
    </div>
  );
}
