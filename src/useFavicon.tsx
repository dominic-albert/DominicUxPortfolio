import { useEffect } from "react";

export function useFavicon() {
  useEffect(() => {
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A259FF"/>
      <stop offset="100%" stop-color="#6B2FFF"/>
    </linearGradient>
  </defs>

  <rect width="64" height="64" rx="14" fill="url(#g)"/>

  <text
    x="50%"
    y="58%"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="Inter, Arial, sans-serif"
    font-size="42"
    font-weight="700"
    fill="white">
    d
  </text>
</svg>
`;

    const link =
      document.querySelector("link[rel='icon']") ??
      document.createElement("link");

    link.setAttribute("rel", "icon");
    link.setAttribute("type", "image/svg+xml");
    link.setAttribute(
      "href",
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    );

    if (!document.head.contains(link)) {
      document.head.appendChild(link);
    }
  }, []);
}