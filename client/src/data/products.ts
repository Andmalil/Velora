export type Category =
  | "All products"
  | "Laptops"
  | "Desktops"
  | "Components"
  | "Monitors"
  | "Accessories";
export type ProductKind =
  "laptop" | "desktop" | "gpu" | "monitor" | "keyboard" | "mouse";
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  kind: ProductKind;
  price: number;
  previousPrice?: number;
  specs: string;
  rating: number;
  reviews: number;
  badge?: string;
  color: string;
  description: string;
  stock?: number;
}
export const categories: Category[] = [
  "All products",
  "Laptops",
  "Desktops",
  "Components",
  "Monitors",
  "Accessories",
];
export const products: Product[] = [
  {
    id: "studio-14",
    name: "StudioBook Pro 14",
    brand: "VELORA",
    category: "Laptops",
    kind: "laptop",
    price: 1499,
    previousPrice: 1699,
    specs: "Core Ultra 7 · 32GB · 1TB SSD",
    rating: 4.9,
    reviews: 128,
    badge: "Bestseller",
    color: "blue",
    description:
      "A lightweight creative powerhouse with a brilliant 14-inch display, an aluminum chassis, and the performance to take your next big idea anywhere.",
  },
  {
    id: "forge",
    name: "Forge Gaming Desktop",
    brand: "VELORA",
    category: "Desktops",
    kind: "desktop",
    price: 1899,
    specs: "Ryzen 7 · RTX 4070 · 32GB",
    rating: 4.8,
    reviews: 86,
    badge: "New arrival",
    color: "purple",
    description:
      "Built for immersive play and demanding work. A balanced gaming tower with quiet cooling, spacious storage, and room for your next upgrade.",
  },
  {
    id: "vision",
    name: "Vision 27” 4K Monitor",
    brand: "VELORA",
    category: "Monitors",
    kind: "monitor",
    price: 449,
    previousPrice: 529,
    specs: "27-inch · 4K IPS · USB-C",
    rating: 4.8,
    reviews: 214,
    badge: "Save $80",
    color: "green",
    description:
      "More space for your ideas. Enjoy a crisp 4K IPS panel, a clean adjustable stand, and convenient USB-C connectivity for your everyday setup.",
  },
  {
    id: "keys",
    name: "Keys Mechanical 75",
    brand: "VELORA",
    category: "Accessories",
    kind: "keyboard",
    price: 129,
    specs: "Wireless · Hot-swappable · RGB",
    rating: 4.9,
    reviews: 173,
    color: "cream",
    description:
      "Make every keystroke count. A compact wireless mechanical keyboard with tactile switches, a comfortable profile, and customizable lighting.",
  },
  {
    id: "graphics",
    name: "GeForce RTX 4070",
    brand: "NVIDIA",
    category: "Components",
    kind: "gpu",
    price: 549,
    previousPrice: 599,
    specs: "12GB GDDR6X · Dual fan",
    rating: 4.8,
    reviews: 96,
    badge: "Save $50",
    color: "green",
    description:
      "Bring your games and creative projects to life with a capable dual-fan graphics card and 12GB of dedicated graphics memory.",
  },
  {
    id: "air",
    name: "AirBook 13",
    brand: "VELORA",
    category: "Laptops",
    kind: "laptop",
    price: 899,
    specs: "Core Ultra 5 · 16GB · 512GB SSD",
    rating: 4.7,
    reviews: 64,
    color: "cream",
    description:
      "Your everyday companion for work, study, and everything in between. A portable 13-inch laptop with a clean design and fast solid-state storage.",
  },
  {
    id: "mouse",
    name: "Arc Wireless Mouse",
    brand: "VELORA",
    category: "Accessories",
    kind: "mouse",
    price: 69,
    specs: "Wireless · 8,000 DPI · USB-C",
    rating: 4.8,
    reviews: 112,
    color: "blue",
    description:
      "A precise, comfortable wireless mouse that fits naturally into your day. Adjustable sensitivity and convenient USB-C charging.",
  },
  {
    id: "ultrawide",
    name: "Horizon 34” Ultrawide",
    brand: "VELORA",
    category: "Monitors",
    kind: "monitor",
    price: 649,
    specs: "34-inch · 144Hz · Curved",
    rating: 4.9,
    reviews: 78,
    badge: "New arrival",
    color: "purple",
    description:
      "See the bigger picture with an expansive ultrawide display. Smooth motion and a panoramic workspace for gaming, editing, and multitasking.",
  },
];
