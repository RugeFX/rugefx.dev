import BootScreen from "@/components/os/boot-screen";
import Desktop from "@/components/os/desktop";
import MessageBox from "@/components/os/message-box";
import Phone from "@/components/os/phone";
import PlainView from "@/components/os/plain-view";
import ShutdownScreen from "@/components/os/shutdown-screen";
import { useOS } from "@/contexts/os-context";
import { usePlayground } from "@/contexts/playground-context";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useKonami } from "@/hooks/use-konami";

/**
 * The whole site. Large screens get a desktop with windows; small screens get
 * a phone home screen. Both are prerendered and CSS shows the right one until
 * hydration, when the other is dropped.
 */
export default function RugeOS() {
  const os = useOS();
  const isDesktop = useIsDesktop();
  const { play, rain, toast } = usePlayground();

  useKonami(() => {
    rain();
    play("tada");
    toast("Cheat code accepted: +30 lives");
  });

  return (
    <>
      <h1 className="sr-only">RugeOS, the portfolio of Ahmad Zacky</h1>
      <BootScreen />
      {os.bootCount > 0 && <BootScreen key={os.bootCount} replay />}
      {isDesktop !== false && (
        <div className="hidden lg:contents">
          <Desktop />
        </div>
      )}
      {isDesktop !== true && (
        <div className="contents lg:hidden">
          <Phone />
        </div>
      )}
      <MessageBox />
      {os.plainView && <PlainView />}
      {os.power === "off" && <ShutdownScreen />}
    </>
  );
}
