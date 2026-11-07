import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
}

/**
 * The RugeFX mark: a chunky "R" on a purple pop tile with a spark. Outline and
 * shadow follow the theme's line colour.
 */
export default function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect x="8" y="8" width="52" height="52" rx="16" className="fill-line" />
      <rect
        x="4.5"
        y="4.5"
        width="52"
        height="52"
        rx="16"
        strokeWidth="3"
        className="fill-brand stroke-line"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        transform="translate(-1.5 -1.5)"
        d="M18 18a2 2 0 0 1 2-2h12a10 10 0 0 1 3.2 19.47l7.3 8.53a1.6 1.6 0 0 1-1.2 2.6h-7.1l-7-9H27v7.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5zM27.2 23.5v6.5h4.3a3.25 3.25 0 0 0 0-6.5z"
      />
      <path
        strokeWidth="2"
        strokeLinejoin="round"
        className="fill-sun stroke-line"
        d="M49 5C49.6 10.4 50.6 11.4 56 12C50.6 12.6 49.6 13.6 49 19C48.4 13.6 47.4 12.6 42 12C47.4 11.4 48.4 10.4 49 5Z"
      />
    </svg>
  );
}
