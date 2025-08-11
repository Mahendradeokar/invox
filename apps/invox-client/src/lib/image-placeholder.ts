const shimmerPlaceholder = () => `
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 400 300"
     width="400" height="300"
     preserveAspectRatio="none">
  <defs>
    <!-- Shimmer gradient -->
    <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e0e0e0"/>
      <stop offset="50%" stop-color="#f5f5f5"/>
      <stop offset="100%" stop-color="#e0e0e0"/>
    </linearGradient>
  </defs>

  <!-- Base background -->
  <rect width="400" height="300" fill="#e0e0e0" />

  <!-- Animated shimmer band -->
  <rect width="400" height="300" fill="url(#shimmer)">
    <animate attributeName="x" from="-400" to="400" dur="1.5s" repeatCount="indefinite" />
  </rect>
</svg>

`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const getImagePlaceholder = () =>
  `data:image/svg+xml;base64,${toBase64(shimmerPlaceholder())}` as const;
