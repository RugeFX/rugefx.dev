import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowDown } from "lucide-react";
import { workExperiences, type WorkExperience } from "@/lib/data";
import { cn } from "@/lib/utils";
import { sectionTitleClass } from "@/components/sections/section-styles";

const experienceStackClass =
  "relative h-(--experience-stack-height) pl-[52px] max-[760px]:pl-9 max-[480px]:pl-0 max-[360px]:h-auto max-[360px]:pl-0 short-viewport:h-auto short-viewport:pl-0 motion-reduce:h-auto motion-reduce:pl-0";
const experienceStageClass =
  "sticky top-(--experience-stack-top) h-[calc(100svh-var(--experience-stack-top)-15px)] before:absolute before:top-[38px] before:bottom-0 before:left-[-37px] before:w-px before:bg-portfolio-divider-strong before:mask-experience-rail max-[760px]:before:left-[-27px] max-[480px]:before:hidden max-[360px]:relative max-[360px]:top-auto max-[360px]:h-auto short-viewport:relative short-viewport:top-auto short-viewport:h-auto short-viewport:before:hidden motion-reduce:relative motion-reduce:top-auto motion-reduce:h-auto motion-reduce:before:hidden";
const experienceCardClass =
  "absolute inset-x-0 top-0 min-h-[470px] rounded-[25px] border border-portfolio-stack-border bg-portfolio-surface text-portfolio-ink shadow-portfolio-stack max-[760px]:min-h-[580px] max-[480px]:min-h-[600px] max-[480px]:rounded-[20px] max-[360px]:relative max-[360px]:inset-auto max-[360px]:mb-5 max-[360px]:min-h-0 max-[360px]:transform-none! short-viewport:relative short-viewport:inset-auto short-viewport:mb-5 short-viewport:min-h-0 short-viewport:transform-none! motion-reduce:relative motion-reduce:inset-auto motion-reduce:mb-5 motion-reduce:min-h-0 motion-reduce:transform-none!";
const experienceMarkerClass =
  "absolute top-[31px] left-[-45px] size-[15px] rounded-full border-2 border-portfolio-brand bg-portfolio-brand shadow-portfolio-timeline-dot will-change-transform max-[760px]:top-[34px] max-[760px]:left-[-34px] max-[760px]:size-[13px] max-[480px]:hidden";
const experienceEndpointClass =
  "absolute bottom-[-3px] left-[-39.5px] z-20 size-1.5 rounded-full bg-portfolio-brand shadow-portfolio-timeline-dot will-change-transform max-[760px]:left-[-29.5px] max-[480px]:hidden short-viewport:hidden motion-reduce:hidden";
const transitionRunwaySvh = 60;
const settledRunwaySvh = 12;
const markerActivationRange = 0.035;
const hintFadeStart = 0.24;
const hintFadeEnd = 0.36;
const finalHintRevealStart = 0.18;
const finalHintRevealEnd = 0.04;

interface ExperienceStackStyle extends CSSProperties {
  "--experience-stack-height": string;
}

export default function ExperienceSection() {
  return (
    <section
      className="scroll-mt-6 pt-[76px] [--experience-stack-step:74px] [--experience-stack-top:18px] max-[760px]:pt-[52px] max-[760px]:[--experience-stack-step:76px] max-[760px]:[--experience-stack-top:12px] max-[480px]:[--experience-stack-step:70px] max-[480px]:[--experience-stack-top:10px]"
      id="experience"
    >
      <div className="mb-9 flex items-end justify-between gap-[30px] max-[760px]:mb-7 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-3">
        <h2 className={sectionTitleClass}>Experience</h2>
        <p className="text-portfolio-copy-muted flex items-center gap-2.5 text-sm leading-normal max-[760px]:max-w-[34ch] [&_svg]:h-[17px] [&_svg]:w-[17px]">
          Scroll through the work that shaped how I build.
          <ArrowDown aria-hidden="true" />
        </p>
      </div>
      <ExperienceStack />
    </section>
  );
}

function ExperienceStack() {
  const stackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageMetrics, setStageMetrics] = useState({ height: 800, step: 74 });
  const shouldReduceMotion = useReducedMotion();
  const transitionCount = Math.max(workExperiences.length - 1, 0);
  const movementRunwaySvh = transitionCount * transitionRunwaySvh;
  const totalRunwaySvh =
    movementRunwaySvh + (transitionCount > 0 ? settledRunwaySvh : 0);
  const settleProgress =
    totalRunwaySvh > 0 ? movementRunwaySvh / totalRunwaySvh : 1;
  const stackStyle: ExperienceStackStyle = {
    "--experience-stack-height": `${100 + totalRunwaySvh}svh`,
  };
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });
  const endpointActivationStart = Math.max(
    settleProgress - markerActivationRange,
    0,
  );
  const endpointScale = useTransform(
    scrollYProgress,
    [endpointActivationStart, settleProgress],
    [0.72, 1],
  );
  const endpointOpacity = useTransform(
    scrollYProgress,
    [endpointActivationStart, settleProgress],
    [0.35, 1],
  );
  const endpointTransform = useTransform(
    endpointScale,
    (value) => `translate3d(0, 0, 0) scale(${value})`,
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateMetrics = () => {
      const computedStyle = window.getComputedStyle(stage);
      const step = Number.parseFloat(
        computedStyle.getPropertyValue("--experience-stack-step"),
      );
      const nextMetrics = {
        height: stage.clientHeight,
        step: Number.isFinite(step) ? step : 74,
      };

      setStageMetrics((current) =>
        current.height === nextMetrics.height &&
        current.step === nextMetrics.step
          ? current
          : nextMetrics,
      );
    };

    updateMetrics();
    const observer = new ResizeObserver(updateMetrics);
    observer.observe(stage);
    window.addEventListener("resize", updateMetrics);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateMetrics);
    };
  }, []);

  return (
    <div className={experienceStackClass} ref={stackRef} style={stackStyle}>
      <div className={experienceStageClass} ref={stageRef}>
        <motion.span
          aria-hidden="true"
          className={experienceEndpointClass}
          style={{ opacity: endpointOpacity, transform: endpointTransform }}
        />
        {workExperiences.map((experience, index) => (
          <ExperienceCard
            key={experience.company}
            experience={experience}
            index={index}
            count={workExperiences.length}
            progress={scrollYProgress}
            stageHeight={stageMetrics.height}
            step={stageMetrics.step}
            settleProgress={settleProgress}
            reduceMotion={Boolean(shouldReduceMotion)}
          />
        ))}
      </div>
    </div>
  );
}

interface ExperienceCardProps {
  experience: WorkExperience;
  index: number;
  count: number;
  progress: MotionValue<number>;
  stageHeight: number;
  step: number;
  settleProgress: number;
  reduceMotion: boolean;
}

function ExperienceCard({
  experience,
  index,
  count,
  progress,
  stageHeight,
  step,
  settleProgress,
  reduceMotion,
}: ExperienceCardProps) {
  const usesDarkSurface = index === 1 || index === 3;
  const segmentCount = Math.max(count - 1, 1);
  const segmentStart =
    index === 0 ? 0 : ((index - 1) / segmentCount) * settleProgress;
  const segmentEnd =
    index === 0 ? settleProgress : (index / segmentCount) * settleProgress;
  const segmentSpan = settleProgress / segmentCount;
  const y = useTransform(
    progress,
    [segmentStart, segmentEnd],
    index === 0 ? [0, 0] : [stageHeight + 32, index * step],
  );
  const transform = useTransform(y, (value) => `translate3d(0, ${value}px, 0)`);
  const markerActivationStart = Math.max(
    segmentStart,
    segmentEnd - markerActivationRange,
  );
  const markerScale = useTransform(
    progress,
    index === 0 ? [0, 1] : [markerActivationStart, segmentEnd],
    index === 0 ? [1, 1] : [0.72, 1],
  );
  const markerOpacity = useTransform(
    progress,
    index === 0 ? [0, 1] : [markerActivationStart, segmentEnd],
    index === 0 ? [1, 1] : [0.35, 1],
  );
  const markerTransform = useTransform(
    markerScale,
    (value) => `translate3d(0, 0, 0) scale(${value})`,
  );
  const isFinalCard = index === count - 1;
  const nextSegmentStart = (index / segmentCount) * settleProgress;
  const hintOpacity = useTransform(
    progress,
    isFinalCard
      ? [
          segmentEnd - segmentSpan * finalHintRevealStart,
          segmentEnd - segmentSpan * finalHintRevealEnd,
        ]
      : [
          nextSegmentStart + segmentSpan * hintFadeStart,
          nextSegmentStart + segmentSpan * hintFadeEnd,
        ],
    isFinalCard ? [0, 1] : [1, 0],
  );

  return (
    <motion.article
      className={cn(
        experienceCardClass,
        index === 0 && "bg-portfolio-tint",
        index === 1 && "border-portfolio-brand bg-portfolio-brand text-white",
        index === 3 &&
          "border-portfolio-ink-strong bg-portfolio-ink-strong text-white",
      )}
      style={
        reduceMotion
          ? { zIndex: 10 + index }
          : { transform, zIndex: 10 + index }
      }
    >
      <motion.span
        aria-hidden="true"
        className={experienceMarkerClass}
        style={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: markerOpacity, transform: markerTransform }
        }
      />
      <header
        className={cn(
          "border-portfolio-stack-line grid min-h-[84px] grid-cols-[minmax(0,1.35fr)_minmax(150px,0.8fr)_auto] items-center gap-7 border-b px-[34px] py-5 max-[760px]:min-h-[86px] max-[760px]:grid-cols-[minmax(0,1fr)_auto] max-[760px]:gap-x-4 max-[760px]:gap-y-[5px] max-[760px]:px-[22px] max-[760px]:py-[15px] max-[480px]:min-h-20 max-[480px]:px-[18px] max-[480px]:py-3.5",
          usesDarkSurface && "border-white/20",
        )}
      >
        <h3 className="font-display overflow-hidden text-xl leading-tight font-semibold tracking-[-0.6px] text-ellipsis whitespace-nowrap max-[760px]:col-span-2 max-[760px]:text-[17px] max-[480px]:text-[15px]">
          {experience.company}
        </h3>
        <p
          className={cn(
            "text-sm leading-[1.4] max-[760px]:text-xs max-[480px]:text-[11px]",
            usesDarkSurface && "text-portfolio-on-brand-muted",
          )}
        >
          {experience.position}
        </p>
        <span
          className={cn(
            "text-sm leading-[1.4] whitespace-nowrap max-[760px]:text-xs max-[480px]:text-[11px]",
            usesDarkSurface && "text-portfolio-on-brand-muted",
          )}
        >
          {experience.duration}
        </span>
      </header>
      <div className="grid-areas-experience max-[760px]:grid-areas-experience-single grid min-h-[385px] grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] gap-x-[50px] gap-y-7 px-[42px] pt-[38px] pb-[30px] max-[760px]:min-h-[494px] max-[760px]:grid-cols-1 max-[760px]:gap-[26px] max-[760px]:px-6 max-[760px]:pt-[30px] max-[760px]:pb-6 max-[480px]:min-h-[518px] max-[480px]:px-5 max-[480px]:pt-[26px] max-[480px]:pb-[21px]">
        <p className="grid-area-lead font-display max-w-[31ch] text-[23px] leading-[1.4] font-medium tracking-[-0.7px] max-[760px]:max-w-[35ch] max-[760px]:text-[21px] max-[480px]:text-[19px]">
          {experience.description[0]}
        </p>
        <div
          className={cn(
            "grid-area-details border-portfolio-stack-line-strong border-l pl-[42px] max-[760px]:border-t max-[760px]:border-l-0 max-[760px]:pt-[25px] max-[760px]:pl-0",
            usesDarkSurface && "border-white/20",
          )}
        >
          <h4 className="mb-[18px] text-base font-semibold">
            What I worked on
          </h4>
          <ul className="list-disc pl-5 text-sm leading-[1.65] max-[480px]:text-[13px] [&_li+li]:mt-3">
            {experience.description.slice(1).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div
          className={cn(
            "grid-area-tech text-portfolio-copy-muted flex flex-wrap self-end text-[13px] leading-[1.7]",
            usesDarkSurface && "text-portfolio-on-dark-muted",
          )}
          aria-label="Technology stack"
        >
          {experience.technologies?.map((tech, techIndex) => (
            <span className="inline-flex items-center" key={tech}>
              {tech}
              {techIndex < (experience.technologies?.length ?? 0) - 1 && (
                <span className="mx-2 opacity-65" aria-hidden="true">
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
        <motion.p
          className={cn(
            "grid-area-hint text-portfolio-copy-subtle inline-flex items-center gap-[7px] justify-self-end text-xs [&_svg]:h-3.5 [&_svg]:w-3.5",
            usesDarkSurface && "text-portfolio-on-dark-muted",
          )}
          aria-hidden="true"
          style={reduceMotion ? { opacity: 1 } : { opacity: hintOpacity }}
        >
          {isFinalCard ? "End of the stack" : "Keep scrolling"}
          <ArrowDown />
        </motion.p>
      </div>
    </motion.article>
  );
}
