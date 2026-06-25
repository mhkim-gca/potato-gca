export default function PotatoIcon({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.19)}
      viewBox="0 0 32 38"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M5 23 C4 17 8 9 17 8 C26 7 30 14 29 21 C28 28 22 35 14 34 C6 33 5 29 5 23Z"
        fill="#c4883a"
      />
      <path
        d="M9 14 C13 10 21 10 25 15"
        stroke="#e0a85c"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="13" cy="22" r="2.5" fill="#6b3b10" />
      <circle cx="21" cy="18" r="2" fill="#6b3b10" />
      <circle cx="18" cy="28" r="1.5" fill="#6b3b10" />
      <path
        d="M17 8 C16 5 14 4 15 2"
        stroke="#3d7018"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse
        cx="14.5"
        cy="2"
        rx="3.5"
        ry="2"
        fill="#4d8820"
        transform="rotate(-25 14.5 2)"
      />
    </svg>
  );
}
