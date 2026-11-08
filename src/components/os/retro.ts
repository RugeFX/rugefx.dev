export const buttonClass =
  "bevel active:bevel-pressed bg-face text-ink inline-flex min-h-8 min-w-22 items-center justify-center gap-2 px-4 text-sm select-none disabled:text-ink-muted disabled:active:bevel [&_svg]:size-4";

export const fieldClass = "bevel-in bg-field text-ink";

/** An etched group box, like a fieldset in a settings dialog. */
export const groupClass =
  "border-face-lo relative border px-3 pt-4 pb-3 shadow-[inset_1px_1px_0_var(--color-face-hi),1px_1px_0_var(--color-face-hi)]";

export const groupLegendClass =
  "bg-face absolute -top-2.5 left-2 px-1 text-sm leading-5";

export const tagClass =
  "bevel bg-face inline-flex items-center gap-1.5 px-2 py-1 text-xs [&_svg]:size-3.5";

export const menuItemClass =
  "hover:bg-brand hover:text-on-brand focus-visible:bg-brand focus-visible:text-on-brand flex w-full items-center gap-3 px-3 py-1.5 text-left text-sm outline-none";

/** A green-on-black monitor readout, for graphs and meters. */
export const screenClass =
  "bevel-in bg-[#07030f] text-mint relative overflow-hidden p-1 font-mono text-xs";
