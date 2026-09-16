import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { projectNavigation } from "@/lib/project-navigation";

interface ImageFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface ImageTransition {
  slug: string;
  src: string;
  from: ImageFrame;
  to: ImageFrame;
  ready: boolean;
}

function frame(element: Element): ImageFrame {
  const rect = element.getBoundingClientRect();
  if (
    element instanceof HTMLImageElement &&
    element.naturalWidth &&
    getComputedStyle(element).objectFit === "contain"
  ) {
    const scale = Math.min(
      rect.width / element.naturalWidth,
      rect.height / element.naturalHeight,
    );
    const width = element.naturalWidth * scale;
    const height = element.naturalHeight * scale;
    return {
      x: rect.x + (rect.width - width) / 2,
      y: rect.y + (rect.height - height) / 2,
      width,
      height,
    };
  }
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
}

// A layer outside the route outlet survives navigation, including a reversal
// before the previous spring has settled. Only the preview image is duplicated.
export default function ProjectImageTransition() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [transition, setTransition] = useState<ImageTransition | null>(null);
  const transitionRef = useRef<ImageTransition | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const scrollBehaviorRef = useRef<string | null>(null);

  const suspendSmoothScroll = useCallback(() => {
    if (scrollBehaviorRef.current !== null) return;
    const root = document.documentElement;
    scrollBehaviorRef.current = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
  }, []);

  const restoreSmoothScroll = useCallback(() => {
    const previousScrollBehavior = scrollBehaviorRef.current;
    if (previousScrollBehavior === null) return;
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
    scrollBehaviorRef.current = null;
  }, []);

  useEffect(() => {
    let raf = 0;
    let fallback: ReturnType<typeof setTimeout> | undefined;
    const clear = () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      transitionRef.current = null;
      setTransition(null);
      restoreSmoothScroll();
    };
    const before = router.subscribe("onBeforeLoad", (event) => {
      if (!event.pathChanged) return;
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      const from = event.fromLocation?.pathname;
      const to = event.toLocation.pathname;
      const opening = from === "/" && to.startsWith("/projects/");
      const closing = from?.startsWith("/projects/") && to === "/";
      if (!opening && !closing) return clear();
      // TanStack's scroll restoration runs during this route change. Hold the
      // root in auto mode before it begins so the destination cannot drift
      // after its viewport frame has been measured.
      suspendSmoothScroll();
      const slug = (opening ? to : from)?.split("/")[2];
      if (!slug || (closing && projectNavigation.origin?.slug !== slug))
        return clear();
      const source = document.querySelector<HTMLImageElement>(
        `[data-project-image="${CSS.escape(slug)}"]`,
      );
      if (opening) {
        projectNavigation.origin = {
          slug,
          historyIndex: event.fromLocation?.state.__TSR_index ?? 0,
          scrollY: window.scrollY,
        };
      }
      if (reduced || !source?.complete || !source.naturalWidth) return clear();
      const activeImage =
        transitionRef.current?.slug === slug ? imageRef.current : null;
      const fromFrame = frame(activeImage ?? source);
      if (fromFrame.width === 0 || fromFrame.height === 0) return clear();
      const next = {
        slug,
        src: source.currentSrc || source.src,
        from: fromFrame,
        to: fromFrame,
        ready: false,
      };
      transitionRef.current = next;
      setTransition(next);
      // Never leave real content hidden after a failed or interrupted route load.
      fallback = setTimeout(clear, 2000);
    });
    const rendered = router.subscribe("onRendered", () => {
      if (!transitionRef.current) return;
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => {
          const current = transitionRef.current;
          if (!current) return;
          const pathname = router.state.location.pathname;
          if (
            pathname === "/" &&
            projectNavigation.origin?.slug === current.slug
          ) {
            window.scrollTo({
              top: projectNavigation.origin.scrollY,
              left: 0,
              behavior: "auto",
            });
          } else if (pathname.startsWith("/projects/")) {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          }
          const target = document.querySelector<HTMLImageElement>(
            `[data-project-image="${CSS.escape(current.slug)}"]`,
          );
          if (!target) return clear();
          const next = { ...current, to: frame(target), ready: true };
          transitionRef.current = next;
          setTransition(next);
        });
      });
    });
    window.addEventListener("resize", clear);
    // Scrolling during the flight should immediately reveal the real image.
    const wheel = () => {
      if (transitionRef.current?.ready) clear();
    };
    window.addEventListener("wheel", wheel, { passive: true });
    return () => {
      before();
      rendered();
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      restoreSmoothScroll();
      window.removeEventListener("resize", clear);
      window.removeEventListener("wheel", wheel);
    };
  }, [reduced, restoreSmoothScroll, router, suspendSmoothScroll]);

  if (!transition || reduced) return null;
  return (
    <>
      <style>{`[data-project-image="${CSS.escape(transition.slug)}"] { opacity: 0 !important; }`}</style>
      <motion.img
        key={transition.slug}
        ref={imageRef}
        data-project-transition=""
        aria-hidden="true"
        alt=""
        src={transition.src}
        className="pointer-events-none fixed top-0 left-0 z-50 object-cover"
        initial={{ ...transition.from }}
        animate={{ ...transition.to }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.03 }}
        onAnimationComplete={() => {
          const current = transitionRef.current;
          if (!current?.ready) return;
          const target = document.querySelector<HTMLImageElement>(
            `[data-project-image="${CSS.escape(current.slug)}"]`,
          );
          // Reveal the real image under the overlay before removing it. Its
          // normal late-load fade remains available when there is no shared
          // transition, but it must not create a blank frame at this handoff.
          if (target?.complete && target.naturalWidth) {
            target.style.transitionDuration = "0ms";
          }
          transitionRef.current = null;
          setTransition(null);
          restoreSmoothScroll();
          if (target) {
            requestAnimationFrame(() => {
              target.style.removeProperty("transition-duration");
            });
          }
        }}
      />
    </>
  );
}
