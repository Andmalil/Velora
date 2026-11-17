import type { Product } from "../data/products";

interface ProductPhotoProps {
  product?: Product;
  featured?: boolean;
}

export default function ProductPhoto({ product, featured = false }: ProductPhotoProps) {
  const src = product?.imageUrl ?? (product || featured
    ? `/products/${encodeURIComponent(product?.id ?? "studio-14")}.webp`
    : undefined);
  return <img className="product-art" src={src} alt={product?.name ?? "StudioBook Pro 14"}
    loading={featured ? "eager" : "lazy"} decoding="async" />;
}
