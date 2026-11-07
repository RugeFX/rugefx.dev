# RugeFX Portfolio

The portfolio of Ahmad Zacky: a playful, hands-on site in RugeFX purple. Peel off and throw the stickers, pull the letters of the name, flip the experience cards, press the skill keycaps, turn on sound effects, and try the Konami code.

## ✨ Features

- **Modern Tech Stack**: React 19, TanStack Start, TypeScript, Vite, Tailwind CSS 4
- **Smooth Animations**: Framer Motion powered animations and transitions
- **Theme Support**: Dark/light mode with system preference detection
- **Responsive Design**: Mobile-first approach with optimal viewing on all devices
- **Timeline UI**: Interactive work experience timeline with connecting lines
- **Project Showcase**: Dynamic project grid with technology tags
- **Performance Focused**: Optimized images and lazy loading
- **Search Ready**: Prerendered routes, route metadata, structured data, and sitemap generation

## 🛠️ Tech Stack

- **Framework**: React 19 with TanStack Start and TanStack Router
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4 with CSS Variables
- **Type**: Bricolage Grotesque, Figtree and Caveat
- **Animations**: Motion for React
- **Icons**: Lucide React & Simple Icons
- **Package Manager**: Bun

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Lint code
bun run lint
```

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Header and footer
│   ├── projects/        # Shared project image transition
│   ├── sections/        # Page sections (hero, about, projects, work experience)
│   └── ui/              # Stickers, bouncy text, section titles, toggles
├── contexts/            # React contexts (theme, sound, confetti and toasts)
├── content/             # Portfolio content and route slugs
├── config/              # Site-wide identity and URL configuration
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, motion helpers, and SEO metadata
├── pages/               # Route-level page compositions
├── routes/              # TanStack Start route definitions
└── assets/              # Static assets (images, icons)
```

## 🎨 Design System

- **Colors**: CSS custom properties with dark/light mode support
- **Typography**: Custom font display with optimized loading
- **Components**: Accessible interaction patterns using React Aria Components
- **Animations**: Smooth enter/exit animations with proper viewport detection
- **Spacing**: Systematic spacing scale using Tailwind CSS

## 📱 Sections

- **Hero**: Draggable stickers that drift with scroll, and a name whose letters hop and spring back
- **About**: Marker highlights, a sticky note, a live Bekasi clock, a character sheet, and a keyboard of skills
- **Work**: Scrapbook polaroids that drop in, get taped down, and fly into the project page
- **Experience**: Cards dealt from a pile that flip over to show the details
- **Contact**: Copy-to-clipboard email with confetti, and sticker links

## 🔧 Development

The project uses strict TypeScript configuration and ESLint for code quality. All components follow React best practices with proper prop typing and error boundaries.

### Key Dependencies

- **Routing and rendering**: TanStack Start with static prerendering
- **Styling**: Tailwind CSS with custom configuration
- **Animation**: Motion for React
- **Icons**: Lucide React for consistent iconography
- **Build**: Vite for fast development and optimized builds

### Deployment output

`bun run build` prerenders the homepage and every linked project page. The
default Nitro build is written to `.output`, with public assets under
`.output/public` and the server entry at `.output/server/index.mjs`.

Vercel deployment is configured by `vercel.json`. Keep the Vercel project on
the **TanStack Start** framework preset and leave the Output Directory unset so
Vercel can consume Nitro's Build Output API result. The existing Git production
branch can remain `main`; each push continues to trigger a production deploy.

## 📄 License

This project is personal portfolio code. Feel free to use as inspiration for your own portfolio!

---

Built with ❤️ by RugeFX
