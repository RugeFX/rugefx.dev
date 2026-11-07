# Agent Guidelines for rugefx.dev

## Build Commands

**Package Manager**: Use `bun` as the primary package manager

- `bun run dev` - Start development server with host binding
- `bun run build` - Generate SEO files, type-check, then Vite build with static prerendering
- `bun run lint` - ESLint with TypeScript (max 0 warnings)
- `bun run preview` - Preview production build

## Code Style

- **Imports**: Use `@/` path alias for src imports, grouped after third-party imports
- **Formatting**: Prettier with Tailwind plugin, 2-space indentation
- **Types**: Strict TypeScript, explicit interfaces, no unused locals/parameters
- **Components**: Function components with `ref` passed as a prop (React 19, no `forwardRef`)
- **Naming**: PascalCase components, camelCase functions/variables, kebab-case file names
- **Styling**: Tailwind CSS 4 with the theme tokens in `src/index.css` (`canvas`/`surface`/`ink`/`line`, the RugeFX purple `brand`, and the `sun`/`mint`/`sky`/`tomato`/`pink` accents), the `pop-press` utility, shared class strings in `components/ui/pop-styles.ts`, and `cn()` from `@/lib/utils`
- **Type**: Bricolage Grotesque (`font-display`) for headings, Figtree for body, Caveat (`font-hand`) for handwritten notes
- **Brand**: The logo is `components/ui/logo-mark.tsx` (also `public/icon.svg`); keep them in sync
- **Playground**: Sound effects, confetti and toasts come from `usePlayground()`; sound is off until the visitor turns it on
- **Motion**: Respect reduced motion (`useReducedMotion`, `motion-reduce:` variants); never render different markup based on it, or hydration breaks
- **Error Handling**: Throw descriptive errors for context misuse

## Architecture

- React 19 + TypeScript + TanStack Start/Router + Vite + Tailwind CSS 4, deployed to Vercel via Nitro
- Routes in `src/routes` are prerendered; page compositions live in `src/pages`
- Design: playful and tactile: draggable stickers, bouncy letters, flip cards, clickable keycaps; `SiteHeader` and `PlaygroundProvider` are rendered in the root route
- Content: portfolio data in `src/content/portfolio.ts`; project slugs in `src/content/project-slugs.ts` (also drives the sitemap)
- State: React Context for themes, hooks for reusable logic
- Icons: Lucide React and Simple Icons; animations: Motion (`motion/react`)
- File structure: `components/ui` for reusable primitives, `components/sections` for page sections, `components/layout` for the header and footer, `components/projects` for the shared project image transition
