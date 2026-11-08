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
- **Styling**: Tailwind CSS 4 with the theme tokens in `src/index.css` (the bevelled `face` chrome colours, `field`, `ink`, the RugeFX purple `brand`, the `title-*` gradient stops, and the `sun`/`mint`/`sky`/`tomato`/`pink` accents), the `bevel`/`bevel-in`/`bevel-pressed`/`bevel-window` utilities, shared class strings in `components/os/retro.ts`, and `cn()` from `@/lib/utils`
- **Type**: Pixelify Sans (`font-pixel`) for titles and chrome, IBM Plex Sans for body, IBM Plex Mono (`font-mono`) for the terminal, readme and addresses
- **Brand**: The logo is the `logo` pixel map in `components/os/pixel-icon.tsx`, rendered by `components/ui/logo-mark.tsx`; regenerate `public/icon.svg` from that map when it changes
- **Playground**: Sound effects, confetti and toasts come from `usePlayground()`; sound is off until the visitor turns it on
- **Window manager**: `useOS()` opens, focuses, minimises and closes windows, shows dialogs, and handles the plain view and power state. Apps are registered in `components/os/apps.ts` and rendered by `components/os/app-view.tsx`; inside an app, `useAppFrame()` closes its window or phone sheet
- **Motion**: Respect reduced motion (`useReducedMotion`, `motion-reduce:` variants); never render different markup based on it, or hydration breaks. The boot screen is CSS-only and plays once per session
- **Error Handling**: Throw descriptive errors for context misuse

## Architecture

- React 19 + TypeScript + TanStack Start/Router + Vite + Tailwind CSS 4, deployed to Vercel via Nitro
- Routes in `src/routes` are prerendered (project pages are listed in `vite.config.ts`). They only set metadata: the root route renders RugeOS, and a `/projects/$projectSlug` URL opens that project's window
- Design: RugeOS, a retro desktop OS in RugeFX purple. Screens 1024px and wider get a desktop with draggable windows, a taskbar and Start menu; smaller screens get a phone home screen. Both shells are prerendered and CSS picks one until hydration
- Content: portfolio data in `src/content/portfolio.ts`, bio and skills in `src/content/about.ts`; project slugs in `src/content/project-slugs.ts` (also drives the sitemap)
- Server: `src/routes/api/github-contributions.ts` reads the public GitHub contributions calendar (no token) and returns JSON with edge caching; `useGithubContributions()` fetches it once per visit for the Task Manager and the terminal
- State: React Context for themes, hooks for reusable logic
- Icons: Lucide React and Simple Icons; animations: Motion (`motion/react`)
- File structure: `components/os` for the shell (desktop, phone, windows, taskbar, menus, dialogs, wallpaper, pixel icons), `components/apps` for the window contents, `components/ui` for the logo
