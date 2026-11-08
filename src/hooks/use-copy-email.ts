import { useCallback } from "react";
import { CONTACT_EMAIL } from "@/config/site";
import { usePlayground } from "@/contexts/playground-context";

/** Copies the contact address with a little celebration. */
export function useCopyEmail() {
  const { burstFrom, play, toast } = usePlayground();

  return useCallback(
    async (from?: Element | null) => {
      try {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
        play("tada");
        if (from) burstFrom(from, 24);
        toast(`${CONTACT_EMAIL} copied to the clipboard`);
      } catch {
        window.location.href = `mailto:${CONTACT_EMAIL}`;
      }
    },
    [burstFrom, play, toast],
  );
}
