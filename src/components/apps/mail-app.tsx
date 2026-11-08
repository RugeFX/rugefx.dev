import { useId, useState } from "react";
import { Copy, Send } from "lucide-react";
import { buttonClass, fieldClass } from "@/components/os/retro";
import { CONTACT_EMAIL, ELSEWHERE_LINKS, RESUME_URL } from "@/config/site";
import { useCopyEmail } from "@/hooks/use-copy-email";
import { cn } from "@/lib/utils";

const rowClass = "grid grid-cols-[4.5rem_1fr] items-center gap-2";

export default function MailApp() {
  const id = useId();
  const copyEmail = useCopyEmail();
  const [subject, setSubject] = useState("Halo, Zacky!");
  const [message, setMessage] = useState("");

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const query = new URLSearchParams({ subject, body: message });
        // URLSearchParams encodes spaces as "+", which mail apps show literally.
        window.location.href = `mailto:${CONTACT_EMAIL}?${query.toString().replace(/\+/g, "%20")}`;
      }}
    >
      <div className="flex shrink-0 gap-1 px-1 pb-1.5">
        <button type="submit" className={cn(buttonClass, "font-semibold")}>
          <Send aria-hidden="true" />
          Send
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={(event) => void copyEmail(event.currentTarget)}
        >
          <Copy aria-hidden="true" />
          Copy address
        </button>
      </div>

      <div className="shrink-0 space-y-1.5 px-1 pb-2 text-sm">
        <div className={rowClass}>
          <span>To:</span>
          <span className={cn(fieldClass, "truncate px-2 py-1")}>
            Ahmad Zacky &lt;{CONTACT_EMAIL}&gt;
          </span>
        </div>
        <label className={rowClass}>
          <span>Subject:</span>
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className={cn(fieldClass, "px-2 py-1 outline-none")}
          />
        </label>
      </div>

      <label htmlFor={`${id}-message`} className="sr-only">
        Message
      </label>
      <textarea
        id={`${id}-message`}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Got a project, a role, or just want to say halo? Write it here and hit Send. Your mail app takes it from there."
        className={cn(
          fieldClass,
          "retro-scroll placeholder:text-ink-muted min-h-32 flex-1 resize-none p-3 text-[15px] leading-relaxed outline-none",
        )}
      />

      <div className="mt-2 shrink-0 px-1 text-sm">
        <p className="text-ink-muted">Or find me elsewhere:</p>
        <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
          {ELSEWHERE_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-brand-ink underline underline-offset-2"
              >
                {link.label}
                {link.href === RESUME_URL ? " ↗" : ""}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}
