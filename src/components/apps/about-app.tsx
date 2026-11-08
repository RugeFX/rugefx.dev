import { useState } from "react";
import { MenuBar } from "@/components/os/menu";
import { fieldClass } from "@/components/os/retro";
import { CONTACT_EMAIL, RESUME_URL } from "@/config/site";
import { bio, facts, now } from "@/content/about";
import { useAppFrame } from "@/contexts/app-frame-context";
import { useOS } from "@/contexts/os-context";
import { cn } from "@/lib/utils";

const sizes = [12, 13, 14, 15, 17, 19];

function Heading({ children }: { children: string }) {
  return (
    <h3 className="mt-6 font-semibold">
      {children}
      <span aria-hidden="true" className="text-ink-muted block">
        {"-".repeat(children.length)}
      </span>
    </h3>
  );
}

export default function AboutApp() {
  const { close } = useAppFrame();
  const { showDialog } = useOS();
  const [wrap, setWrap] = useState(true);
  const [size, setSize] = useState(3);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MenuBar
        label="Notepad"
        menus={[
          {
            label: "File",
            entries: [
              {
                label: "Open résumé",
                onSelect: () => window.open(RESUME_URL, "_blank", "noopener"),
              },
              "separator",
              { label: "Close", onSelect: close },
            ],
          },
          {
            label: "Format",
            entries: [
              {
                label: "Word wrap",
                checked: wrap,
                onSelect: () => setWrap((value) => !value),
              },
              {
                label: "Larger text",
                disabled: size === sizes.length - 1,
                onSelect: () => setSize((value) => value + 1),
              },
              {
                label: "Smaller text",
                disabled: size === 0,
                onSelect: () => setSize((value) => value - 1),
              },
            ],
          },
          {
            label: "Help",
            entries: [
              {
                label: "About Notepad",
                onSelect: () =>
                  showDialog({
                    title: "About Notepad",
                    message:
                      "Notepad for RugeOS. It only opens one file, but it's a good one.",
                  }),
              },
            ],
          },
        ]}
      />
      <div
        className={cn(
          fieldClass,
          "retro-scroll min-h-0 flex-1 overflow-auto p-1 font-mono select-text",
        )}
      >
        <article
          className={cn(
            "px-3 py-3 leading-relaxed",
            wrap ? "max-w-[68ch] whitespace-pre-wrap" : "w-max whitespace-pre",
          )}
          style={{ fontSize: sizes[size] }}
        >
          <h3 className="font-semibold">README.txt</h3>
          <span aria-hidden="true" className="text-ink-muted">
            ==========
          </span>
          <p className="mt-4">Hi! I&apos;m Ahmad Zacky, a.k.a. RugeFX.</p>
          {bio.map((paragraph) => (
            <p key={paragraph} className="mt-3">
              {paragraph}
            </p>
          ))}

          <Heading>RIGHT NOW</Heading>
          <p>{now}</p>

          <Heading>THE FACTS</Heading>
          <dl>
            {facts.map(([term, detail]) => (
              <div key={term} className="flex">
                <dt className="shrink-0">{`${term} `.padEnd(13, ".")} </dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>

          <Heading>SAY HALO</Heading>
          <p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-brand-ink underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
            {"\n"}or open Mail from the desktop.
          </p>
        </article>
      </div>
      <div className="mt-0.5 flex shrink-0 gap-0.5 text-xs">
        <span className="bevel-thin flex-1 px-2 py-1">UTF-8</span>
        <span className="bevel-thin w-20 px-2 py-1">
          {Math.round((sizes[size] / sizes[3]) * 100)}%
        </span>
      </div>
    </div>
  );
}
