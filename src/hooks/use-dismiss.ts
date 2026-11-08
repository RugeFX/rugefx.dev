import { useEffect, useRef, type RefObject } from "react";

/** Closes a menu when the pointer goes down anywhere outside it. */
export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
) {
  const callback = useRef(onClose);

  useEffect(() => {
    callback.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const listen = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) callback.current();
    };
    document.addEventListener("pointerdown", listen, true);
    return () => document.removeEventListener("pointerdown", listen, true);
  }, [open, ref]);
}
