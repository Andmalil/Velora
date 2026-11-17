import { Truck, ShieldCheck, Headphones, Package } from "lucide-react";

export default function Benefits() {
  return (
    <section className="benefits" aria-label="Store benefits">
      <div>
        <Truck />
        <span>
          <strong>Shipping, on us</strong>
          <small>On every order over $100</small>
        </span>
      </div>
      <div>
        <ShieldCheck />
        <span>
          <strong>Shop with confidence</strong>
          <small>30-day returns, no stress</small>
        </span>
      </div>
      <div>
        <Headphones />
        <span>
          <strong>Real people. Real help.</strong>
          <small>Expert support when you need it</small>
        </span>
      </div>
      <div>
        <Package />
        <span>
          <strong>Quality comes standard</strong>
          <small>Carefully selected. Built to last.</small>
        </span>
      </div>
    </section>
  );
}
