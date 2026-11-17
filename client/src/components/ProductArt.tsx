import type { ProductKind } from "../data/products";

export default function ProductArt({
  kind,
  id = "art",
}: {
  kind: ProductKind;
  id?: string;
}) {
  const fill = `url(#${id}-screen)`;
  return (
    <svg
      viewBox="0 0 400 280"
      fill="none"
      aria-hidden="true"
      className={`product-art art-${kind}`}
    >
      <defs>
        <linearGradient
          id={`${id}-screen`}
          x1="60"
          y1="20"
          x2="340"
          y2="250"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#132f38" />
          <stop offset=".4" stopColor="#248d88" />
          <stop offset=".7" stopColor="#a9dbc4" />
          <stop offset="1" stopColor="#244c62" />
        </linearGradient>
        <linearGradient id={`${id}-metal`} x1="80" y1="90" x2="340" y2="220">
          <stop stopColor="#e7e9e8" />
          <stop offset="1" stopColor="#8b9296" />
        </linearGradient>
      </defs>
      <ellipse
        cx="200"
        cy="245"
        rx="145"
        ry="12"
        fill="#152c25"
        opacity=".09"
      />
      {(kind === "laptop" || kind === "monitor") && (
        <>
          <rect
            x={kind === "monitor" ? 48 : 67}
            y="37"
            width={kind === "monitor" ? 304 : 266}
            height="173"
            rx="9"
            fill="#252a2b"
          />
          <rect
            x={kind === "monitor" ? 55 : 74}
            y="44"
            width={kind === "monitor" ? 290 : 252}
            height="158"
            rx="4"
            fill={fill}
          />
          <path
            d="M78 193C155 45 190 240 327 55M80 165C183 6 195 195 325 66M92 200C190 75 220 240 329 90"
            stroke="#def6dc"
            strokeWidth="17"
            opacity=".23"
          />
          {kind === "laptop" ? (
            <>
              <path
                d="M67 210H333L373 235Q374 243 361 245H39Q27 244 28 236Z"
                fill={`url(#${id}-metal)`}
              />
              <path d="M75 216H326L344 230H56Z" fill="#61696c" />
              <path d="M168 232H234L240 239H161Z" fill="#bbc1c2" />
            </>
          ) : (
            <>
              <path d="M186 210H214L220 239H180Z" fill="#9da6a6" />
              <path d="M150 239H250L265 245H135Z" fill="#c8cdcd" />
            </>
          )}
        </>
      )}
      {kind === "desktop" && (
        <>
          <path d="M108 46L256 32L302 60V234L148 248L108 223Z" fill="#272b30" />
          <path d="M148 74L291 62V226L148 239Z" fill="#11181f" />
          <path d="M115 55L140 77V230L115 216Z" fill="#50555d" />
          {[105, 166].map((y) => (
            <g key={y}>
              <ellipse
                cx="247"
                cy={y}
                rx="28"
                ry="30"
                fill="#1b2730"
                stroke="#a7a1eb"
                strokeWidth="5"
              />
              <ellipse
                cx="247"
                cy={y}
                rx="19"
                ry="21"
                stroke="#56c5bd"
                strokeWidth="4"
              />
              <ellipse cx="247" cy={y} rx="6" ry="7" fill="#a9a2e6" />
            </g>
          ))}
          <path
            d="M161 108L204 104V160L161 164Z"
            fill="#3b414d"
            stroke="#6d7799"
            strokeWidth="2"
          />
          <path d="M164 181L220 176V195L164 201Z" fill="#68747d" />
          <path d="M157 216L280 204" stroke="#a8a2ed" strokeWidth="3" />
        </>
      )}
      {kind === "keyboard" && (
        <g transform="translate(35 85) rotate(-9 165 70)">
          <rect width="330" height="130" rx="13" fill="#a9aba6" />
          <rect x="0" y="0" width="330" height="120" rx="12" fill="#d7d9ce" />
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 14 }, (_, col) => (
              <rect
                key={`${row}-${col}`}
                x={10 + col * 22}
                y={9 + row * 21}
                width="18"
                height="16"
                rx="3"
                fill={col > 10 || col === 0 ? "#7c9282" : "#f9f8f0"}
                stroke="#b5b9ae"
                strokeWidth=".5"
              />
            )),
          )}
          <rect x="97" y="93" width="122" height="16" rx="3" fill="#f9f8f0" />
        </g>
      )}
      {kind === "gpu" && (
        <g transform="translate(42 75) rotate(-8 160 75)">
          <rect x="0" y="0" width="316" height="132" rx="12" fill="#303638" />
          <path d="M10 10H304V122H10Z" stroke="#737e7c" strokeWidth="3" />
          {[87, 230].map((x) => (
            <g key={x}>
              <circle
                cx={x}
                cy="66"
                r="48"
                fill="#191e20"
                stroke="#929e99"
                strokeWidth="3"
              />
              {Array.from({ length: 9 }, (_, i) => (
                <path
                  key={i}
                  d={`M${x} 64Q${x + 42} 25 ${x + 13} 25L${x + 6} 57Z`}
                  fill="#505d57"
                  transform={`rotate(${i * 40} ${x} 66)`}
                />
              ))}
              <circle cx={x} cy="66" r="12" fill="#87988c" />
            </g>
          ))}
          <path d="M50 133H195V143H50" fill="#c8b264" />
        </g>
      )}
      {kind === "mouse" && (
        <g transform="translate(135 40) rotate(-20 65 100)">
          <path
            d="M0 80C0-23 130-23 130 80V142C130 231 0 231 0 142Z"
            fill="#e1e5e3"
            stroke="#aab8b2"
            strokeWidth="2"
          />
          <path d="M65 7V92M5 91H125" stroke="#aab8b2" strokeWidth="2" />
          <rect x="58" y="35" width="14" height="35" rx="7" fill="#59756b" />
        </g>
      )}
    </svg>
  );
}
