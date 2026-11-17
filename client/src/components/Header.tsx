import { useState } from "react";
import { ChevronDown, Search, ShoppingBag, Menu, X } from "lucide-react";
import type { Browse } from "../types/store";
import Logo from "./Logo";
interface HeaderProps {
  browse: Browse;
  count: number;
  onSearch: () => void;
  onOpenCart: () => void;
}

export default function Header({
  browse: onBrowse,
  count,
  onSearch,
  onOpenCart,
}: HeaderProps) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const browse: Browse = (category, dealsOnly) => {
    setMobileMenu(false);
    onBrowse(category, dealsOnly);
  };
  return (
    <header className="header">
      <Logo symbol />
      <nav
        aria-label="Main navigation"
        className={mobileMenu ? "nav open" : "nav"}
      >
        <button onClick={() => browse()}>
          Shop all <ChevronDown size={13} />
        </button>
        <button onClick={() => browse("Laptops")}>Laptops</button>
        <button onClick={() => browse("Desktops")}>Desktops</button>
        <button onClick={() => browse("Components")}>Components</button>
        <button
          className="deals-link"
          onClick={() => browse("All products", true)}
        >
          Deals <span />
        </button>
      </nav>
      <div className="header-actions">
        <button
          className="icon-button search-shortcut"
          aria-label="Search products"
          onClick={() => {
            onSearch();
          }}
        >
          <Search size={21} />
        </button>
        <span className="header-divider" />
        <button
          className="cart-button"
          onClick={() => {
            onOpenCart();
          }}
          aria-label={`Open cart, ${count} items`}
        >
          <ShoppingBag size={20} />
          <span>Cart</span>
          <b>{count}</b>
        </button>
        <button
          className="icon-button mobile-toggle"
          aria-label="Toggle navigation"
          aria-expanded={mobileMenu}
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
