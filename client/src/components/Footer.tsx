import { ArrowRight } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer>
      <Logo />
      <span>Better tech. More possibility.</span>
      <small>© {new Date().getFullYear()} Velora. Demo storefront.</small>
      <a href="#shop">
        Let’s find your upgrade <ArrowRight size={14} />
      </a>
    </footer>
  );
}
