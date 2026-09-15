import { useId } from "react";
import indonesiaMap from "@/assets/indonesia.svg";

export default function IndonesiaLocationMap() {
  const maskId = `indonesia-map-${useId().replace(/:/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      className="text-portfolio-map-marker absolute inset-x-[-10px] bottom-[-6px] h-[132px] w-[calc(100%+20px)] overflow-visible"
      preserveAspectRatio="xMidYMid meet"
      viewBox="-2.65 150.83 1210.3 561.34"
    >
      <defs>
        <mask
          id={maskId}
          x="-2.65"
          y="150.83"
          width="1210.3"
          height="561.34"
          maskUnits="userSpaceOnUse"
        >
          <image
            href={indonesiaMap}
            x="-2.65"
            y="150.83"
            width="1210.3"
            height="561.34"
            preserveAspectRatio="none"
          />
        </mask>
      </defs>

      <rect
        className="text-portfolio-map-fill fill-current [opacity:var(--portfolio-map-opacity)]"
        x="-2.65"
        y="150.83"
        width="1210.3"
        height="561.34"
        mask={`url(#${maskId})`}
      />

      <g transform="translate(311 569)">
        <circle
          className="motion-safe:animate-location-pulse origin-center fill-current [transform-box:fill-box]"
          r="22"
        />
        <circle
          className="stroke-portfolio-tint fill-current"
          r="17"
          strokeWidth="8"
        />
      </g>
    </svg>
  );
}
