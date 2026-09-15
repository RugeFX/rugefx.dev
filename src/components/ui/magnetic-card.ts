import {
  useCallback,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "motion/react";

export const magneticCardClass =
  "motion-safe:transition-[translate,scale,border-color,box-shadow] motion-safe:duration-150 motion-safe:ease-out motion-safe:active:[scale:0.99] motion-safe:data-[magnetic-returning=true]:duration-300";

export const magneticLinkCardClass =
  "group/magnetic-link motion-safe:hover:[scale:1.008]";

export const magneticLinkArrowClass =
  "transition-transform duration-[160ms] ease-out motion-safe:group-hover/magnetic-link:translate-x-[3px] motion-safe:group-hover/magnetic-link:-translate-y-[3px] motion-reduce:transform-none motion-reduce:transition-none";

export function useMagneticCard(maxOffset = 3) {
  const shouldReduceMotion = useReducedMotion();
  const boundsRef = useRef<DOMRect | null>(null);

  const captureBounds = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (shouldReduceMotion || event.pointerType !== "mouse") return;
      event.currentTarget.dataset.magneticReturning = "false";
      boundsRef.current = event.currentTarget.getBoundingClientRect();
    },
    [shouldReduceMotion],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (shouldReduceMotion || event.pointerType !== "mouse") return;

      const card = event.currentTarget;
      const bounds = boundsRef.current ?? card.getBoundingClientRect();
      boundsRef.current = bounds;
      const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;
      const offsetX = Math.max(
        -maxOffset,
        Math.min(maxOffset, normalizedX * 2 * maxOffset),
      );
      const offsetY = Math.max(
        -maxOffset,
        Math.min(maxOffset, normalizedY * 2 * maxOffset),
      );

      card.dataset.magneticReturning = "false";
      card.style.translate = `${offsetX.toFixed(2)}px ${offsetY.toFixed(2)}px`;
    },
    [maxOffset, shouldReduceMotion],
  );

  const resetMagneticCard = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const card = event.currentTarget;
      boundsRef.current = null;
      card.dataset.magneticReturning = "true";
      card.style.translate = "0px 0px";
    },
    [],
  );

  return {
    onPointerCancel: resetMagneticCard,
    onPointerEnter: captureBounds,
    onPointerLeave: resetMagneticCard,
    onPointerMove: handlePointerMove,
  };
}
