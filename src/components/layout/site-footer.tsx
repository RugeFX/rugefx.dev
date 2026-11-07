import { motion, useReducedMotion } from "motion/react";
import { ArrowUp, Sparkle, Star } from "lucide-react";
import BouncyText from "@/components/ui/bouncy-text";
import CopyEmailButton from "@/components/ui/copy-email-button";
import { CONTACT_EMAIL, ELSEWHERE_LINKS, SITE_AUTHOR } from "@/config/site";
import { usePlayground } from "@/contexts/playground-context";

const linkTilts = [-6, 4, -3, 7];

export default function SiteFooter() {
  const reduced = useReducedMotion();
  const { play } = usePlayground();

  return (
    <footer
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-28 pb-10 md:px-8 md:pt-40"
    >
      <motion.div
        className="border-line bg-brand text-on-brand shadow-pop-lg relative isolate overflow-hidden rounded-[40px] border-2 px-6 py-16 text-center md:px-16 md:py-24"
        initial={reduced ? false : { scale: 0.86, rotate: -3, y: 60 }}
        whileInView={{ scale: 1, rotate: 0, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 160, damping: 15 }}
      >
        <Star
          aria-hidden="true"
          className="animate-float text-sun absolute top-10 left-[8%] -z-10 size-14 fill-current"
        />
        <Sparkle
          aria-hidden="true"
          className="animate-float text-mint absolute right-[10%] bottom-12 -z-10 size-16 fill-current [animation-delay:-3s]"
        />
        <span
          aria-hidden="true"
          className="animate-float bg-pink absolute top-1/3 right-[6%] -z-10 size-8 rounded-full [animation-delay:-1.5s]"
        />

        <p className="font-hand text-3xl md:text-4xl">got an idea?</p>
        <h2
          id="contact-title"
          className="font-display mx-auto mt-2 max-w-5xl text-[clamp(48px,9vw,136px)] leading-[0.9] font-extrabold tracking-[-0.045em]"
        >
          <BouncyText
            text="Let's build something fun."
            colors={["sun", "mint", "sky", "pink"]}
          />
        </h2>
        <div className="mt-10 flex flex-col items-center gap-3">
          <CopyEmailButton className="bg-sun text-on-accent h-14 px-7 text-lg" />
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-sm font-semibold underline decoration-2 underline-offset-4 opacity-90 hover:opacity-100"
          >
            or open your mail app
          </a>
        </div>
        <ul className="mt-12 flex flex-wrap justify-center gap-4">
          {ELSEWHERE_LINKS.map(({ label, href }, index) => (
            <motion.li
              key={label}
              initial={{ rotate: linkTilts[index] }}
              whileHover={
                reduced ? undefined : { rotate: 0, scale: 1.1, y: -4 }
              }
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
            >
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                onPointerEnter={() => play("pop")}
                className="bg-surface text-ink font-display shadow-sticker block rounded-full border-[3px] border-white px-5 py-2 font-extrabold"
              >
                {label} ↗
              </a>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <div className="text-ink-muted mt-8 flex flex-col items-center justify-between gap-3 px-2 text-sm md:flex-row">
        <p>
          © {new Date().getFullYear()} {SITE_AUTHOR}. Built with React 19,
          TanStack Start, Tailwind CSS and far too many springs.
        </p>
        <p className="font-hand text-xl" title="Try it on your keyboard">
          psst: ↑ ↑ ↓ ↓ ← → ← → B A
        </p>
        <a
          href="#top"
          className="hover:text-brand-ink inline-flex items-center gap-1.5 font-bold transition-colors"
        >
          Back to top <ArrowUp aria-hidden="true" className="size-4" />
        </a>
      </div>
    </footer>
  );
}
