# Project Structure

```
src/
├── components/
│   ├── sections/          # Page section components (Hero, CTA, FAQ, etc.)
│   ├── ui/                # Reusable UI primitives (Button, Card)
│   ├── Navbar.astro       # Main navigation (Alpine.js)
│   ├── Footer.astro       # Site footer
│   └── AnimateOnScroll.astro # Scroll animation wrapper
├── config/
│   ├── site.ts            # Site settings (reads from CMS JSON)
│   └── navigation.ts      # Nav menu structure
├── content/
│   ├── pages/             # CMS-managed page content (JSON)
│   │   └── locations/     # Location-specific pages
│   └── settings/          # Site-wide settings (JSON)
├── layouts/
│   └── BaseLayout.astro   # Main HTML wrapper with SEO
├── lib/
│   └── utils.ts           # Utility functions (cn helper)
├── pages/
│   └── [...slug].astro    # Dynamic page router
├── styles/
│   └── global.css         # Tailwind imports, CSS variables, brand utilities
└── content.config.ts      # Content collection schemas

public/
├── fonts/                 # Poppins font files
└── images/                # Static images

.pages.yml                 # Pages CMS configuration
astro.config.mjs           # Astro configuration
```

## Key Patterns

### Page Routing
- `[...slug].astro` handles all pages via `getStaticPaths()`
- Pages loaded from `src/content/pages/*.json`
- Homepage is `index.json` (slug: undefined)

### Section Components
- Each section type has a corresponding component
- Sections use flat format: `{ type: 'hero', title: '...', ... }`
- All components are Astro (server-rendered, no client JS)

### Interactivity
- Alpine.js for dropdowns, accordions, mobile menu
- No client-side React hydration

### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)

### Brand Colors
- Set via CSS variables in BaseLayout from `siteConfig.colors`
- Use `bg-brand-primary`, `text-brand-secondary`, etc.
- Opacity variants: `bg-brand-primary/50`
