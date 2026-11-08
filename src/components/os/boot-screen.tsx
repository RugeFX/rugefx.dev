import LogoMark from "@/components/ui/logo-mark";

interface BootScreenProps {
  /** Plays again after a shutdown, even if this visit already booted. */
  replay?: boolean;
}

const biosLines = [
  "RugeFX BIOS v26.11  (c) Ahmad Zacky",
  "Memory test ........ 640K OK",
  "Detecting kopi ..... found (hot)",
  "Loading portfolio .. 4 projects",
];

/**
 * Plays once per visit. It runs on CSS alone (see `.boot-screen` in
 * index.css), so the prerendered desktop is never stuck behind it.
 */
export default function BootScreen({ replay }: BootScreenProps) {
  return (
    <div
      aria-hidden="true"
      data-replay={replay ? "" : undefined}
      className="boot-screen fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#07030f] text-[#ddd0ff] [--color-pixel-ink:#d9ccf0]"
    >
      <pre className="absolute top-5 left-5 font-mono text-[11px] leading-relaxed opacity-70 sm:text-xs">
        {biosLines.join("\n")}
      </pre>
      <LogoMark className="size-24" />
      <p className="font-pixel mt-5 text-4xl font-bold tracking-wide">
        Ruge<span className="text-sun">OS</span>
      </p>
      <div className="mt-6 h-5 w-56 border-2 border-[#ddd0ff]/60 p-[3px]">
        <div
          data-boot-bar=""
          className="size-full bg-[repeating-linear-gradient(90deg,#7c3aed_0_10px,transparent_10px_13px)]"
        />
      </div>
      <p className="mt-3 font-mono text-xs opacity-60">Starting RugeOS…</p>
    </div>
  );
}
