import { useEffect } from "react";
import { useOS } from "@/contexts/os-context";

export default function ShutdownScreen() {
  const { powerOn } = useOS();

  useEffect(() => {
    const listen = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.metaKey || event.ctrlKey) return;
      event.preventDefault();
      powerOn();
    };
    window.addEventListener("keydown", listen);
    return () => window.removeEventListener("keydown", listen);
  }, [powerOn]);

  return (
    <button
      type="button"
      onClick={powerOn}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-black px-6 text-center outline-none"
    >
      <span className="font-pixel max-w-[18ch] text-3xl leading-snug text-[#ff9b3d] md:text-5xl">
        It&apos;s now safe to turn off your computer.
      </span>
      <span className="font-mono text-sm text-[#ff9b3d]/70">
        Or press any key to start RugeOS again.
      </span>
    </button>
  );
}
