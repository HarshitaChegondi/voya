const Logo = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="logo-svg"
  >
    {/* Outer window frame */}
    <rect width="28" height="28" rx="7" fill="rgba(167,139,250,0.12)" />

    {/* Window oval */}
    <rect
      x="4" y="2" width="20" height="24" rx="10"
      stroke="var(--accent)" strokeWidth="1.8" fill="none"
    />

    {/* Inner oval */}
    <rect
      x="6.5" y="4.5" width="15" height="19" rx="7.5"
      stroke="var(--accent)" strokeWidth="0.8" fill="none" opacity="0.25"
    />

    {/* Horizon line */}
    <line
      x1="4" y1="17" x2="24" y2="17"
      stroke="var(--accent)" strokeWidth="0.7" opacity="0.15"
    />

    {/* Destination dot 1 — top left */}
    <circle cx="10" cy="10" r="2" stroke="var(--accent)" strokeWidth="1.2" fill="none" opacity="0.7" />
    <circle cx="10" cy="10" r="0.8" fill="var(--accent)" opacity="0.7" />

    {/* Destination dot 2 — top right */}
    <circle cx="18" cy="9" r="2" stroke="var(--accent)" strokeWidth="1.2" fill="none" opacity="0.7" />
    <circle cx="18" cy="9" r="0.8" fill="var(--accent)" opacity="0.7" />

    {/* Destination dot 3 — center */}
    <circle cx="14" cy="13" r="2" stroke="var(--accent)" strokeWidth="1.2" fill="none" opacity="0.7" />
    <circle cx="14" cy="13" r="0.8" fill="var(--accent)" opacity="0.7" />

    {/* Dashed route lines */}
    <line
      x1="11.8" y1="9.5" x2="16.2" y2="9.2"
      stroke="var(--accent)" strokeWidth="0.8" strokeDasharray="1.5 1.2" opacity="0.4"
    />
    <line
      x1="14" y1="11" x2="18" y2="11"
      stroke="var(--accent)" strokeWidth="0.8" strokeDasharray="1.5 1.2" opacity="0.35"
    />

    {/* City glow curves below horizon */}
    <path
      d="M6 20 Q10 17 14 18.5 Q18 20 22 17.5"
      stroke="var(--accent)" strokeWidth="1.2" fill="none" opacity="0.35" strokeLinecap="round"
    />
    <path
      d="M6 22 Q10 19.5 14 21 Q18 22.5 22 20"
      stroke="var(--accent)" strokeWidth="0.8" fill="none" opacity="0.2" strokeLinecap="round"
    />

    {/* Small arrow plane */}
    <g transform="translate(12,7.5) rotate(20)">
      <path d="M0 2L8 0l-1.8 2 1.8 2L0 2z" fill="var(--accent)" opacity="0.8" />
    </g>
  </svg>
)

export default Logo
