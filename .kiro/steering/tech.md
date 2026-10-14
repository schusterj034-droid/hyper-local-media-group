# Tech Stack

## Core Framework
- **Astro 5** - Static site generator
- **React 19** - Server-side only (icon rendering via lucide-react)
- **TypeScript** - Strict mode enabled

## Styling
- **Tailwind CSS 4** - Utility-first CSS via Vite plugin
- **tw-animate-css** - Animation utilities
- **CSS Variables** - Brand colors via `--brand-*` custom properties
- **Poppins** - Custom font loaded from `/public/fonts/`

## CMS & Content
- **Pages CMS** - Git-based headless CMS (external, edits JSON via GitHub)
- **Astro Content Collections** - Type-safe content with Zod schemas
- Content stored as JSON in `src/content/`
- CMS config in `.pages.yml` at repo root

## UI Components
- **Radix UI** - Accessible primitives (Slot)
- **shadcn/ui pattern** - Components in `src/components/ui/`
- **class-variance-authority** - Component variants
- **Lucide React** - Icon library (server-side rendering only)
- **@lucide/astro** - Astro-native icons

## Deployment
- **Vercel** - Static deployment with `@astrojs/vercel` adapter
- **Static output mode** - Pre-rendered at build time

## Package Manager
- **Bun** - Fast JavaScript runtime and package manager

## Common Commands
```bash
bun install          # Install dependencies
bun dev              # Start dev server (localhost:4321)
bun build            # Production build to ./dist/
bun preview          # Preview production build
bun astro check      # TypeScript/Astro validation
```

## Key Dependencies
- `@astrojs/sitemap` - Auto-generated sitemap
- `tailwind-merge` + `clsx` - Class name utilities
