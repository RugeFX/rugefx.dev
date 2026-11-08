import { useEffect, useState } from "react";
import type { Contributions } from "@/lib/github-contributions";

type State =
  | { status: "loading" }
  | { status: "ready"; data: Contributions }
  | { status: "error" };

// One request per visit, shared by every window that asks.
let request: Promise<Contributions> | null = null;

function load() {
  request ??= fetch("/api/github-contributions")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json() as Promise<Contributions>;
    })
    .catch((error) => {
      request = null;
      throw error;
    });
  return request;
}

export function useGithubContributions(): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let active = true;
    load().then(
      (data) => active && setState({ status: "ready", data }),
      () => active && setState({ status: "error" }),
    );
    return () => {
      active = false;
    };
  }, []);

  return state;
}

export { load as loadGithubContributions };
