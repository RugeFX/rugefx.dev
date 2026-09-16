import { rm } from "node:fs/promises";

await Promise.all(
  ["../dist", "../.output", "../.vercel/output"].map((directory) =>
    rm(new URL(directory, import.meta.url), {
      force: true,
      recursive: true,
    }),
  ),
);
