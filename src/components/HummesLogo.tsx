/**
 * Logo leve (SVG) – pensado pra ficar bonito em 20–28px.
 * Verde WhatsApp premium + traço clean.
 */
export function HummesLogo({ size = 28 }: { size?: number }) {
  return (
    <div className="logoWrap" style={{ width: size, height: size }} aria-label="Hummes">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <path
          d="M32 6C18.2 6 7 16.53 7 29.6c0 6.55 2.91 12.47 7.58 16.77-.35 4.2-1.78 8.4-3.7 11.1-.44.62.23 1.44.97 1.2 5.7-1.86 9.73-4.38 12.1-6.13 2.6.76 5.35 1.17 8.05 1.17 13.8 0 25-10.53 25-23.6C57 16.53 45.8 6 32 6Z"
          fill="url(#g)"
        />
        <path
          d="M22 27.8c0 2.06-1.68 3.73-3.75 3.73-2.07 0-3.75-1.67-3.75-3.73 0-2.06 1.68-3.73 3.75-3.73 2.07 0 3.75 1.67 3.75 3.73Zm27.5 0c0 2.06-1.68 3.73-3.75 3.73S42 29.86 42 27.8c0-2.06 1.68-3.73 3.75-3.73s3.75 1.67 3.75 3.73Z"
          fill="white"
          opacity="0.95"
        />
        <path
          d="M20.2 38.2c3.25 3.45 7.3 5.15 12.2 5.15 4.9 0 8.95-1.7 12.2-5.15"
          stroke="white"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.92"
        />
        <defs>
          <linearGradient id="g" x1="10" y1="12" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#16a34a" />
            <stop offset="1" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
