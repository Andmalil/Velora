interface LogoProps {
  symbol?: boolean;
}

export default function Logo({ symbol = false }: LogoProps) {
  return (
    <a className="logo" href="#" aria-label="Velora home">
      {symbol && <span className="logo-symbol">v</span>}velora
      <span className="logo-dot">.</span>
    </a>
  );
}
