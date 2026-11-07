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
- **Components**: Function components with `ref` passed as a prop (React 19, no `forwardRef`); keep cva variants in separate `*-variants.ts` files
- **Naming**: PascalCase components, camelCase functions/variables, kebab-case file names
- **Styling**: Tailwind CSS 4 with `portfolio-*` theme tokens and `cn()` from `@/lib/utils`
- **Motion**: Respect reduced motion (`useReducedMotion`, `motion-reduce:` variants)
- **Error Handling**: Throw descriptive errors for context misuse

## Architecture

- React 19 + TypeScript + TanStack Start/Router + Vite + Tailwind CSS 4, deployed to Vercel via Nitro
- Routes in `src/routes` are prerendered; page compositions live in `src/pages`
- Component library: React Aria Components primitives with shadcn-style custom styling
- Content: portfolio data in `src/content/portfolio.ts`; project slugs in `src/content/project-slugs.ts` (also drives the sitemap)
- State: React Context for themes, hooks for reusable logic
- Icons: Lucide React and Simple Icons; animations: Motion (`motion/react`)
- File structure: `components/ui` for reusable primitives, `components/sections` for page sections, `components/hero`, `components/projects`, and `components/layout` for feature-specific pieces
