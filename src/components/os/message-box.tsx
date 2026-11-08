import { useEffect, useId, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import PixelIcon from "@/components/os/pixel-icon";
import { buttonClass } from "@/components/os/retro";
import {
  useOS,
  type DialogButton,
  type DialogIcon,
} from "@/contexts/os-context";

/** Shows the dialog the OS asked for, one at a time. */
export default function MessageBox() {
  const { dialog, dismissDialog } = useOS();

  return (
    <AnimatePresence>
      {dialog && (
        <DialogBox
          key={dialog.id}
          title={dialog.title}
          icon={dialog.icon}
          buttons={dialog.buttons}
          onDismiss={dismissDialog}
        >
          {dialog.message}
        </DialogBox>
      )}
    </AnimatePresence>
  );
}

interface DialogBoxProps {
  title: string;
  icon?: DialogIcon;
  buttons?: DialogButton[];
  onDismiss: () => void;
  children: ReactNode;
}

export function DialogBox({
  title,
  icon = "info",
  buttons = [{ label: "OK" }],
  onDismiss,
  children,
}: DialogBoxProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.querySelector<HTMLElement>("[data-dialog-button]")?.focus();
    return () => {
      // Hand focus back, unless whatever the dialog did has moved it on.
      const active = document.activeElement;
      if (!active || active === document.body || dialog?.contains(active)) {
        previous?.focus?.();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4">
      <motion.div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-message`}
        className="bevel-window bg-face text-ink w-full max-w-[440px] p-[3px]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 520, damping: 32 }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            onDismiss();
          }
          // Keep keyboard focus on the dialog's buttons.
          if (event.key === "Tab") {
            const focusable = [
              ...ref.current!.querySelectorAll<HTMLElement>("button"),
            ];
            const index = focusable.indexOf(
              document.activeElement as HTMLElement,
            );
            const next = event.shiftKey ? index - 1 : index + 1;
            event.preventDefault();
            focusable[(next + focusable.length) % focusable.length]?.focus();
          }
        }}
      >
        <div className="title-active flex h-7 items-center gap-2 pr-0.5 pl-2 text-white">
          <h2
            id={`${id}-title`}
            className="font-pixel flex-1 truncate text-[15px] tracking-wide"
          >
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onDismiss}
            className="bevel active:bevel-pressed bg-face text-ink grid h-[18px] w-5 place-items-center"
          >
            <svg viewBox="0 0 9 9" className="size-[9px] fill-current">
              <path d="M0 0h2l2.5 3L7 0h2L5.5 4.5 9 9H7L4.5 6 2 9H0l3.5-4.5z" />
            </svg>
          </button>
        </div>
        <div className="flex items-start gap-4 px-4 pt-5 pb-4">
          <PixelIcon name={icon} className="size-8" />
          <div id={`${id}-message`} className="pt-1 text-sm leading-relaxed">
            {children}
          </div>
        </div>
        <div className="flex justify-center gap-2 pb-3">
          {buttons.map((button) => (
            <button
              key={button.label}
              type="button"
              data-dialog-button=""
              className={buttonClass}
              onClick={() => {
                onDismiss();
                button.onClick?.();
              }}
            >
              {button.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
