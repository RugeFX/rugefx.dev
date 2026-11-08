# RugeFX Portfolio

The portfolio of Ahmad Zacky, built as **RugeOS**: a little retro operating system in RugeFX purple. Drag and resize windows, browse projects in a file explorer, run commands in a terminal, poke at skills in the Task Manager, right-click the desktop, and try the Konami code. On phones it becomes a home screen of apps, and Start → Plain view puts everything on one page.

## ✨ Features

- **Modern Tech Stack**: React 19, TanStack Start, TypeScript, Vite, Tailwind CSS 4
- **Smooth Animations**: Framer Motion powered animations and transitions
- **Theme Support**: Dark/light mode with system preference detection
- **Responsive Design**: Mobile-first approach with optimal viewing on all devices
- **Window Manager**: Draggable, resizable, minimisable windows with a taskbar and Start menu
- **Project Showcase**: A file explorer of projects; each project window has its own URL
- **Performance Focused**: Optimized images and lazy loading
- **Search Ready**: Prerendered routes, route metadata, structured data, and sitemap generation

## 🛠️ Tech Stack

- **Framework**: React 19 with TanStack Start and TanStack Router
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4 with CSS Variables
- **Type**: Pixelify Sans, IBM Plex Sans and IBM Plex Mono
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
│   ├── apps/            # Window contents (welcome, readme, projects, terminal…)
│   ├── os/              # Desktop, phone, windows, taskbar, menus, wallpaper, icons
│   └── ui/              # The logo
├── contexts/            # React contexts (theme, window manager, sound and confetti)
├── content/             # Portfolio content and route slugs
├── config/              # Site-wide identity and URL configuration
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, motion helpers, and SEO metadata
├── routes/              # TanStack Start route definitions
└── assets/              # Static assets (images, icons)
```

## 🎨 Design System

- **Colors**: A lilac take on the classic bevelled grey, RugeFX purple title bars, and a dusk or night pixel-art wallpaper for light and dark mode
- **Typography**: Pixel type for chrome and titles, a readable sans for body copy, and a mono for the terminal
- **Icons**: Hand-drawn 16×16 pixel icons, including the logo
- **Accessibility**: Real buttons, menus with arrow-key navigation, tabs, focus-trapped dialogs, reduced-motion support, and a plain view

## 🖥️ Apps

- **Welcome**: The intro, quick links, and a rotating tip of the day
- **readme.txt**: The bio in Notepad, with word wrap and text size options
- **Projects**: A file explorer with icon and details views; projects open in a viewer window at `/projects/<slug>`
- **Work History**: A properties dialog with a tab per job
- **Task Manager**: Skills as running processes, live CPU numbers, a performance graph, and my GitHub contributions heatmap
- **Terminal**: `help`, `projects`, `open`, `neofetch`, `sudo hire-me` and a few hidden commands
- **Mail**: Write a message that opens in your mail app, or copy the address
- **Recycle Bin**: Some things are better left deleted

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
