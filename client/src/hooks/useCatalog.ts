import { useCallback, useEffect, useMemo, useState } from "react";
import type { Category, Product } from "../data/products";
import { api } from "../data/api";

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProducts(await api<Product[]>("/products"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load catalog");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void reload();
  }, [reload]);
  const [category, setCategory] = useState<Category>("All products");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [dealsOnly, setDealsOnly] = useState(false);
  const visible = useMemo(() => {
    const result = products.filter(
      (p) =>
        (category === "All products" || p.category === category) &&
        (!dealsOnly || p.previousPrice) &&
        `${p.name} ${p.brand} ${p.specs} ${p.category} ${p.kind} ${p.description}`
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
    );
    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "rating")
      result.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    return result;
  }, [products, category, query, sort, dealsOnly]);

  return {
    products,
    loading,
    error,
    reload,
    category,
    setCategory,
    query,
    setQuery,
    sort,
    setSort,
    dealsOnly,
    setDealsOnly,
    visible,
  };
}
