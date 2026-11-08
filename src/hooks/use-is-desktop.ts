import { useSyncExternalStore } from "react";

const query = "(min-width: 1024px)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Whether the desktop (rather than the phone) shell fits. Null while
 * prerendering and hydrating, when both shells render and CSS picks one.
 */
export function useIsDesktop(): boolean | null {
  return useSyncExternalStore<boolean | null>(
    subscribe,
    () => window.matchMedia(query).matches,
    () => null,
  );
}
