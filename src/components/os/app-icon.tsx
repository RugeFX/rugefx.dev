import type { AppMeta } from "@/components/os/apps";
import PixelIcon from "@/components/os/pixel-icon";
import LogoMark from "@/components/ui/logo-mark";

interface AppIconProps {
  icon: AppMeta["icon"];
  className?: string;
}

export default function AppIcon({ icon, className }: AppIconProps) {
  return icon === "logo" ? (
    <LogoMark className={className} />
  ) : (
    <PixelIcon name={icon} className={className} />
  );
}
