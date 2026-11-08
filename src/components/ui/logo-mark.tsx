import PixelIcon from "@/components/os/pixel-icon";

interface LogoMarkProps {
  className?: string;
}

/**
 * The RugeFX mark: a pixel "R" on a purple tile with a spark. It is drawn from
 * the `logo` map in the pixel icon set, which also produces `public/icon.svg`.
 */
export default function LogoMark({ className }: LogoMarkProps) {
  return <PixelIcon name="logo" className={className} />;
}
