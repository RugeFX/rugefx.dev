import SiteFooter from "@/components/layout/site-footer";
import AboutSection from "@/components/sections/about-section";
import ExperienceSection from "@/components/sections/experience-section";
import HeroSection from "@/components/sections/hero-section";
import WorkSection from "@/components/sections/work-section";
import ScrollRibbons from "@/components/ui/scroll-ribbons";
import { usePlayground } from "@/contexts/playground-context";
import { useKonami } from "@/hooks/use-konami";

export default function HomePage() {
  const { play, rain, toast } = usePlayground();

  useKonami(() => {
    rain();
    play("tada");
    toast("Cheat code accepted. +30 lives!");
  });

  return (
    <>
      <main>
        <HeroSection />
        <ScrollRibbons
          bands={[
            {
              words: [
                "React",
                "React Native",
                "TypeScript",
                "Laravel",
                "Next.js",
                "Docker",
                "Expo",
              ],
              accent: "brand",
              tilt: -3,
            },
            {
              words: ["web", "mobile", "IoT", "dashboards", "APIs", "kopi"],
              accent: "sun",
              tilt: 2.5,
              reverse: true,
            },
          ]}
        />
        <AboutSection />
        <WorkSection />
        <ExperienceSection />
        <ScrollRibbons
          bands={[
            {
              words: ["say halo", "ideas welcome", "Bekasi → anywhere"],
              accent: "mint",
              tilt: -2,
            },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
