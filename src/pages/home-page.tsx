import { useEffect, useState } from "react";
import AboutSection from "@/components/sections/about-section";
import ExperienceSection from "@/components/sections/experience-section";
import HeroSection from "@/components/sections/hero-section";
import ProjectsSection from "@/components/sections/projects-section";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const portfolioRootClass =
  "bg-portfolio-canvas text-portfolio-ink min-h-screen flow-root font-sans [&_a]:no-underline [&_a:focus-visible]:outline-[3px] [&_a:focus-visible]:outline-offset-[5px] [&_a:focus-visible]:outline-portfolio-focus [&_button:focus-visible]:outline-[3px] [&_button:focus-visible]:outline-offset-[5px] [&_button:focus-visible]:outline-portfolio-focus motion-reduce:[&_*]:scroll-auto motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:transition-none";

let hasPlayedInitialEntrance = false;

export default function HomePage() {
  const [shouldPlayInitialEntrance] = useState(() => !hasPlayedInitialEntrance);

  useEffect(() => {
    if (shouldPlayInitialEntrance) {
      hasPlayedInitialEntrance = true;
    }
  }, [shouldPlayInitialEntrance]);

  return (
    <div className={portfolioRootClass}>
      <div className="mx-auto max-w-[1280px] px-8 max-[1120px]:px-6 max-[760px]:px-[18px] max-[480px]:px-[14px]">
        <SiteHeader shouldPlayInitialEntrance={shouldPlayInitialEntrance} />
        <main>
          <HeroSection shouldPlayInitialEntrance={shouldPlayInitialEntrance} />
          <div className="mt-[75px] max-[760px]:mt-[45px]">
            <AboutSection />
          </div>
          <ExperienceSection />
          <ProjectsSection />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
