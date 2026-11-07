import { type VariantProps } from "class-variance-authority";
import {
  ToggleButton as TogglePrimitive,
  type ToggleButtonProps,
} from "react-aria-components";

import { toggleVariants } from "@/components/ui/toggle-variants";
import { cn } from "@/lib/utils";

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: ToggleButtonProps & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle };
