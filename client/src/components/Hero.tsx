import { ArrowRight, Sparkles } from "lucide-react";
import type { Browse, ProductAction } from "../types/store";
import type { Product } from "../data/products";
import { money } from "../utils/money";
import ProductArt from "./ProductArt";
interface HeroProps {
  browse: Browse;
  onSelect: ProductAction;
  product?: Product;
}

export default function Hero({ browse, onSelect, product }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow">
          <span /> THE NEXT CHAPTER OF YOUR SETUP
        </div>
        <h1>
          Upgrade your
          <br />
          everyday<span>.</span>
        </h1>
        <p>
          Big ideas deserve better tech. Discover computers,
          <br className="desktop-break" /> components, and essentials that move
          you forward.
        </p>
        <div className="hero-buttons">
          <button className="button primary" onClick={() => browse()}>
            Find your next upgrade <ArrowRight size={17} />
          </button>
          <button
            className="text-button"
            onClick={() => browse("All products", true)}
          >
            Explore deals <ArrowRight size={16} />
          </button>
        </div>
        <div className="hero-proof">
          <div className="avatar-stack">
            <span>JD</span>
            <span>AK</span>
            <span>ML</span>
            <span>SR</span>
          </div>
          <div>
            <div className="stars">
              ★★★★★ <strong>4.9/5</strong>
            </div>
            <small>For the love of a better setup.</small>
          </div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <span className="hero-watermark">CREATE.</span>
        <div className="hero-art">
          <ProductArt kind="laptop" id="hero" />
        </div>
        <div className="hero-float">
          <span className="float-icon">
            <Sparkles size={17} />
          </span>
          <span>
            More power. Less limits.<small>Meet the StudioBook Pro 14</small>
          </span>
        </div>
        <div className="hero-price">
          <span>YOUR NEXT BIG THING</span>
          <strong>StudioBook Pro 14</strong>
          <div>
            {product ? money(product.price) : "Explore the collection"}{" "}
            <button
              aria-label="View StudioBook Pro 14"
              onClick={() => (product ? onSelect(product) : browse())}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        <div className="hero-pagination">
          <span />
          <i />
          <i />
          <small>01 — 03</small>
        </div>
      </div>
    </section>
  );
}
