import {
  SlidersHorizontal,
  Laptop,
  Cpu,
  Monitor,
  Headphones,
} from "lucide-react";
import { categories } from "../data/products";
import type { Category } from "../data/products";
interface CategoryTabsProps {
  category: Category;
  onChange: (category: Category) => void;
}

export default function CategoryTabs({
  category,
  onChange,
}: CategoryTabsProps) {
  return (
    <div className="category-tabs" role="group" aria-label="Product categories">
      {categories.map((item, index) => {
        const Icon = [SlidersHorizontal, Laptop, Cpu, Cpu, Monitor, Headphones][
          index
        ];
        return (
          <button
            key={item}
            className={category === item ? "active" : ""}
            aria-pressed={category === item}
            onClick={() => onChange(item)}
          >
            <Icon size={17} />
            {item}
          </button>
        );
      })}
    </div>
  );
}
