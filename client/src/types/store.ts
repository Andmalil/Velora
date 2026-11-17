import type { Category, Product } from "../data/products";

export type Cart = Record<string, number>;
export type Browse = (category?: Category, dealsOnly?: boolean) => void;
export type ProductAction = (product: Product) => void;
