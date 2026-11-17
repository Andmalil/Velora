import { useRef, useState } from "react";
import type { Category, Product } from "./data/products";
import { useCart } from "./hooks/useCart";
import { useCatalog } from "./hooks/useCatalog";
import { useToast } from "./hooks/useToast";
import Announcement from "./components/Announcement";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import Catalog from "./components/Catalog";
import SetupBanner from "./components/SetupBanner";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import ProductDetails from "./components/ProductDetails";
import CartModal from "./components/CartModal";

export default function App() {
  const catalog = useCatalog();
  const cart = useCart(catalog.products);
  const toast = useToast();
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const catalogRef = useRef<HTMLElement>(null);

  function browse(category: Category = "All products", dealsOnly = false) {
    catalog.setCategory(category);
    catalog.setDealsOnly(dealsOnly);
    catalog.setQuery("");
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function add(product: Product) {
    if (await cart.add(product))
      toast.show(`${product.name} added to your cart`);
  }

  function focusSearch() {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
    document.getElementById("search")?.focus();
  }

  return (
    <>
      <Announcement />
      <Header
        browse={browse}
        count={cart.count}
        onSearch={focusSearch}
        onOpenCart={() => setCartOpen(true)}
      />
      <main>
        <Hero
          browse={browse}
          onSelect={setSelected}
          product={catalog.products[0]}
        />
        <Benefits />
        {catalog.loading && (
          <p className="service-notice" role="status">
            Loading catalog…
          </p>
        )}
        {catalog.error && (
          <div className="service-notice" role="alert">
            {catalog.error}{" "}
            <button onClick={() => void catalog.reload()}>Retry catalog</button>
          </div>
        )}
        {cart.error && (
          <div className="service-notice" role="alert">
            {cart.error}{" "}
            <button onClick={() => void cart.reload()}>Reload cart</button>
          </div>
        )}
        <Catalog
          catalogRef={catalogRef}
          category={catalog.category}
          onCategoryChange={catalog.setCategory}
          query={catalog.query}
          onQueryChange={catalog.setQuery}
          dealsOnly={catalog.dealsOnly}
          onDealsChange={catalog.setDealsOnly}
          sort={catalog.sort}
          onSortChange={catalog.setSort}
          products={catalog.visible}
          browse={browse}
          onSelect={setSelected}
          onAdd={add}
        />
        <SetupBanner browse={browse} />
      </main>
      <Footer />
      {toast.message && <Toast message={toast.message} />}
      {selected && (
        <ProductDetails
          product={selected}
          onClose={() => setSelected(null)}
          onAdd={add}
        />
      )}
      {cartOpen && (
        <CartModal
          cart={cart.cart}
          products={cart.items}
          count={cart.count}
          total={cart.total}
          onClose={() => setCartOpen(false)}
          onBrowse={() => {
            setCartOpen(false);
            browse();
          }}
          onQuantityChange={cart.changeQuantity}
          onRemove={cart.remove}
          busy={cart.busy || !cart.ready}
          error={cart.error}
          onOrdered={() => {
            cart.clear();
            void catalog.reload();
          }}
        />
      )}
    </>
  );
}
