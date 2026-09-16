# RugeFX Portfolio

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. Features smooth animations, dark/light theme switching, and a clean design showcasing projects and work experience.

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
- **UI Components**: React Aria Components and shadcn/ui
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
│   ├── layout/          # Layout components (header, footer, etc.)
│   ├── sections/        # Page sections (hero, about, projects, work experience)
│   ├── theme/           # Theme toggler component
│   └── ui/              # Reusable UI components
├── contexts/            # React contexts (theme provider)
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

- **Hero**: Personal introduction with animated elements
- **About**: Journey and technology background
- **Work Experience**: Timeline-based professional history
- **Projects**: Featured work with live demos and source code

## 🔧 Development

The project uses strict TypeScript configuration and ESLint for code quality. All components follow React best practices with proper prop typing and error boundaries.

### Key Dependencies

- **Routing and rendering**: TanStack Start with static prerendering
- **UI**: React Aria Components and shadcn/ui
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
