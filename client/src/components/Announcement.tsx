import { Truck } from "lucide-react";

export default function Announcement() {
  return (
    <div className="announcement">
      <span>Good gear. Better possibilities.</span>
      <span>
        <Truck size={13} /> Free shipping on orders $100+{" "}
        <span className="announcement-divider">|</span> Built around you.
      </span>
    </div>
  );
}
