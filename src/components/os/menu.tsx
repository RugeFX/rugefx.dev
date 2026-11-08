import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { menuItemClass } from "@/components/os/retro";
import { useDismiss } from "@/hooks/use-dismiss";
import { cn } from "@/lib/utils";

export type MenuEntry =
  | "separator"
  | {
      label: string;
      icon?: ReactNode;
      onSelect?: () => void;
      href?: string;
      submenu?: MenuEntry[];
      checked?: boolean;
      disabled?: boolean;
    };

interface MenuListProps {
  entries: MenuEntry[];
  label: string;
  onClose: () => void;
  /** Set on submenus: returns focus to the item that opened them. */
  onBack?: () => void;
  autoFocus?: boolean;
  className?: string;
}

const itemSelector = ":scope > li > [role^='menuitem']";

export function MenuList({
  entries,
  label,
  onClose,
  onBack,
  autoFocus = true,
  className,
}: MenuListProps) {
  const ref = useRef<HTMLUListElement>(null);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  useEffect(() => {
    if (autoFocus) {
      ref.current?.querySelector<HTMLElement>(itemSelector)?.focus();
    }
  }, [autoFocus]);

  const items = () => [
    ...(ref.current?.querySelectorAll<HTMLElement>(itemSelector) ?? []),
  ];

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLElement);
    const move = (to: number) => {
      event.preventDefault();
      list[(to + list.length) % list.length]?.focus();
    };
    switch (event.key) {
      case "ArrowDown":
        move(index + 1);
        break;
      case "ArrowUp":
        move(index - 1);
        break;
      case "Home":
        move(0);
        break;
      case "End":
        move(list.length - 1);
        break;
      case "ArrowLeft":
        if (!onBack) return;
        event.preventDefault();
        onBack();
        break;
      case "Escape":
        event.preventDefault();
        if (onBack) onBack();
        else onClose();
        break;
      case "Tab":
        onClose();
        break;
      default:
        return;
    }
    event.stopPropagation();
  };

  return (
    <ul
      ref={ref}
      role="menu"
      aria-label={label}
      className={cn("bevel bg-face text-ink min-w-48 p-[3px]", className)}
      onKeyDown={onKeyDown}
    >
      {entries.map((entry, index) => {
        if (entry === "separator") {
          return (
            <li
              key={`separator-${index}`}
              role="separator"
              className="border-face-lo border-b-face-hi mx-1 my-1 border-y"
            />
          );
        }
        const content = (
          <>
            <span className="grid w-5 shrink-0 place-items-center">
              {entry.checked !== undefined
                ? entry.checked && <CheckGlyph />
                : entry.icon}
            </span>
            <span className="flex-1 whitespace-nowrap">{entry.label}</span>
            {entry.submenu && <ArrowGlyph />}
            {entry.href && (
              <span aria-hidden="true" className="text-xs opacity-70">
                ↗
              </span>
            )}
          </>
        );
        const className = cn(
          menuItemClass,
          entry.disabled && "text-ink-muted pointer-events-none",
          openSubmenu === index && "bg-brand text-on-brand",
        );
        return (
          <li
            key={entry.label}
            role="none"
            className="relative"
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") {
                setOpenSubmenu(entry.submenu ? index : null);
              }
            }}
          >
            {entry.href ? (
              <a
                role="menuitem"
                href={entry.href}
                target="_blank"
                rel="noreferrer"
                className={className}
                onClick={onClose}
              >
                {content}
              </a>
            ) : (
              <button
                type="button"
                role={
                  entry.checked !== undefined ? "menuitemcheckbox" : "menuitem"
                }
                aria-checked={entry.checked}
                aria-haspopup={entry.submenu ? "menu" : undefined}
                aria-expanded={
                  entry.submenu ? openSubmenu === index : undefined
                }
                aria-disabled={entry.disabled || undefined}
                className={className}
                onClick={() => {
                  if (entry.disabled) return;
                  if (entry.submenu) {
                    setOpenSubmenu(openSubmenu === index ? null : index);
                    return;
                  }
                  onClose();
                  entry.onSelect?.();
                }}
                onKeyDown={(event) => {
                  if (entry.submenu && event.key === "ArrowRight") {
                    event.preventDefault();
                    event.stopPropagation();
                    setOpenSubmenu(index);
                  }
                }}
              >
                {content}
              </button>
            )}
            {entry.submenu && openSubmenu === index && (
              <MenuList
                entries={entry.submenu}
                label={entry.label}
                onClose={onClose}
                onBack={() => {
                  setOpenSubmenu(null);
                  items()[index]?.focus();
                }}
                className="absolute top-0 left-full z-10 -ml-1"
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

interface MenuBarProps {
  label: string;
  menus: { label: string; entries: MenuEntry[] }[];
}

/** A window's File / Edit / View menu bar. */
export function MenuBar({ label, menus }: MenuBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  useDismiss(ref, open !== null, () => setOpen(null));

  return (
    <div
      ref={ref}
      role="menubar"
      aria-label={label}
      className="flex h-6 shrink-0 items-center px-0.5 text-sm select-none"
    >
      {menus.map((menu, index) => (
        <div key={menu.label} className="relative">
          <button
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={open === index}
            className={cn(
              "px-2 py-0.5",
              open === index ? "bevel-pressed" : "hover:bevel-thin",
            )}
            onClick={() => setOpen(open === index ? null : index)}
            onPointerEnter={() => {
              if (open !== null) setOpen(index);
            }}
          >
            {menu.label}
          </button>
          {open === index && (
            <MenuList
              entries={menu.entries}
              label={menu.label}
              onClose={() => {
                setOpen(null);
                const triggers = ref.current?.querySelectorAll<HTMLElement>(
                  ":scope > div > button",
                );
                triggers?.[index]?.focus();
              }}
              className="absolute top-full left-0 z-30"
            />
          )}
        </div>
      ))}
    </div>
  );
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 7 7" className="size-[7px] fill-current">
      <path d="M6 0h1v2H6v1H5v1H4v1H3v1H2V5H1V4H0V2h1v1h1v1h1V3h1V2h1V1h1z" />
    </svg>
  );
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 4 7" aria-hidden="true" className="h-[7px] fill-current">
      <path d="M0 0h1v1h1v1h1v1h1v1H3v1H2v1H1v1H0z" />
    </svg>
  );
}
