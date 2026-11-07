import { Fragment, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Sparkle } from "lucide-react";
import { accentBackground, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface Band {
  words: string[];
  accent: Accent;
  tilt: number;
  reverse?: boolean;
}

interface ScrollRibbonsProps {
  bands: [Band] | [Band, Band];
}

/**
 * Tilted ribbons of words that slide sideways as the page scrolls. With two
 * bands they cross like tape on a parcel.
 */
export default function ScrollRibbons({ bands }: ScrollRibbonsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative grid overflow-x-clip py-16 md:py-24"
    >
      {bands.map((band, index) => (
        <Ribbon key={index} band={band} progress={scrollYProgress} />
      ))}
    </div>
  );
}

interface RibbonProps {
  band: Band;
  progress: MotionValue<number>;
}

function Ribbon({ band, progress }: RibbonProps) {
  const reduced = useReducedMotion();
  const distance = reduced ? ["0%", "0%"] : ["0%", "-35%"];
  const x = useTransform(
    progress,
    [0, 1],
    band.reverse ? [...distance].reverse() : distance,
  );
  const words = [...band.words, ...band.words, ...band.words, ...band.words];

  return (
    <div
      className={cn(
        "border-line col-start-1 row-start-1 -mx-[5vw] self-center border-y-2 py-3 md:py-4",
        accentBackground[band.accent],
      )}
      style={{ rotate: `${band.tilt}deg` }}
    >
      <motion.div
        className="font-display flex w-max items-center gap-5 text-2xl font-extrabold tracking-tight whitespace-nowrap md:gap-7 md:text-4xl"
        style={{ x }}
      >
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span>{word}</span>
            <Sparkle className="size-5 shrink-0 fill-current md:size-7" />
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}
