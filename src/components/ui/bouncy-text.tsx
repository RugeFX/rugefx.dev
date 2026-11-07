import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePlayground } from "@/contexts/playground-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { accentHex, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

const defaultColors: Accent[] = [
  "brand",
  "sun",
  "mint",
  "sky",
  "tomato",
  "pink",
];

interface BouncyTextProps {
  text: string;
  className?: string;
  /** Colours a letter may flash on hover. */
  colors?: Accent[];
}

/**
 * Letters that hop when hovered and can be pulled like fridge magnets; they
 * spring back to their place when released.
 */
export default function BouncyText({
  text,
  className,
  colors = defaultColors,
}: BouncyTextProps) {
  const reduced = useReducedMotion();
  const canDrag = useMediaQuery("(hover: hover) and (pointer: fine)");
  const { play } = usePlayground();
  let letterIndex = 0;

  return (
    <span className={cn("inline", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, wordIndex, words) => (
          <span key={`${word}-${wordIndex}`}>
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((character) => {
                const index = letterIndex++;
                return (
                  <motion.span
                    key={`${character}-${index}`}
                    // The hover colour lives in CSS rather than Motion: Motion
                    // would restore the colour captured at hover time, which
                    // goes stale once the theme changes.
                    className={cn(
                      "inline-block transition-colors duration-150 hover:text-(--hover-color)",
                      canDrag && "cursor-grab active:cursor-grabbing",
                    )}
                    style={
                      {
                        "--hover-color":
                          accentHex[colors[index % colors.length]],
                      } as CSSProperties
                    }
                    whileHover={
                      reduced
                        ? undefined
                        : {
                            y: -12,
                            rotate: index % 2 ? 9 : -9,
                            transition: {
                              type: "spring",
                              stiffness: 500,
                              damping: 12,
                            },
                          }
                    }
                    drag={canDrag && !reduced}
                    dragSnapToOrigin
                    dragElastic={0.65}
                    dragTransition={{ bounceStiffness: 520, bounceDamping: 13 }}
                    whileDrag={{ scale: 1.18, zIndex: 20 }}
                    onDragStart={() => play("pop")}
                  >
                    {character}
                  </motion.span>
                );
              })}
            </span>
            {wordIndex < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </span>
  );
}
