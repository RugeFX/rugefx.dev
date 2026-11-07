interface WindowBarProps {
  label: string;
}

/** The title bar of a cartoon app window. */
export default function WindowBar({ label }: WindowBarProps) {
  return (
    <div className="border-line flex items-center gap-1.5 border-b-2 px-4 py-3">
      <span className="border-line bg-tomato size-3 rounded-full border-2" />
      <span className="border-line bg-sun size-3 rounded-full border-2" />
      <span className="border-line bg-mint size-3 rounded-full border-2" />
      <span className="text-ink-muted ml-3 truncate text-sm font-semibold">
        {label}
      </span>
    </div>
  );
}
