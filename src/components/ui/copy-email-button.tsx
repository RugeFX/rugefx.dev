import { Copy } from "lucide-react";
import { popButtonClass } from "@/components/ui/pop-styles";
import { CONTACT_EMAIL } from "@/config/site";
import { usePlayground } from "@/contexts/playground-context";
import { cn } from "@/lib/utils";

interface CopyEmailButtonProps {
  label?: string;
  className?: string;
}

export default function CopyEmailButton({
  label = CONTACT_EMAIL,
  className,
}: CopyEmailButtonProps) {
  const { burstFrom, play, toast } = usePlayground();

  return (
    <button
      type="button"
      className={cn(popButtonClass, className)}
      onClick={async (event) => {
        const button = event.currentTarget;
        try {
          await navigator.clipboard.writeText(CONTACT_EMAIL);
          burstFrom(button);
          play("tada");
          toast("Email copied. Talk soon!");
        } catch {
          window.location.href = `mailto:${CONTACT_EMAIL}`;
        }
      }}
    >
      {label}
      <Copy aria-hidden="true" />
      <span className="sr-only">(copies {CONTACT_EMAIL})</span>
    </button>
  );
}
