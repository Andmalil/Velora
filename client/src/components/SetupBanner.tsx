import { Cpu, ArrowRight } from "lucide-react";
import type { Browse } from "../types/store";
interface SetupBannerProps {
  browse: Browse;
}

export default function SetupBanner({ browse }: SetupBannerProps) {
  return (
    <section className="setup-banner">
      <div className="setup-icon">
        <Cpu size={35} />
      </div>
      <div>
        <span className="eyebrow">A SETUP THAT FEELS LIKE YOU</span>
        <h2>Small changes. Big possibilities.</h2>
        <p>
          Make room for your best work, your next win, and everything in
          between.
        </p>
      </div>
      <button className="button primary" onClick={() => browse("Accessories")}>
        Meet your desk essentials <ArrowRight size={17} />
      </button>
    </section>
  );
}
