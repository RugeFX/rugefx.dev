import { useEffect, useRef } from "react";
import PlainContent from "@/components/os/plain-content";
import { buttonClass } from "@/components/os/retro";
import { useOS } from "@/contexts/os-context";

/** The one-page version, opened from inside RugeOS. */
export default function PlainView() {
  const { setPlainView } = useOS();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Plain view"
      className="retro-scroll bg-field text-ink fixed inset-0 z-[80] overflow-y-auto"
      onKeyDown={(event) => {
        if (event.key === "Escape") setPlainView(false);
      }}
    >
      <div className="bg-face bevel sticky top-0 z-10 flex h-12 items-center justify-between gap-3 px-3">
        <span className="font-pixel text-lg">Plain view</span>
        <button
          ref={closeRef}
          type="button"
          className={buttonClass}
          onClick={() => setPlainView(false)}
        >
          Back to RugeOS
        </button>
      </div>

      <PlainContent onOpenProject={() => setPlainView(false)} />
    </div>
  );
}
