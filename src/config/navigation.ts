import {
  Handshake,
  MapPin,
  Monitor,
  Globe,
  CircleDot,
  Share2,
  Palette,
  Megaphone,
  DollarSign,
  Tv,
  Target,
  Music,
  Award,
  type LucideIcon,
} from "lucide-react"

import navbarJson from '../content/settings/navbar.json';
import footerJson from '../content/settings/footer.json';

// Icon map for resolving icon names from JSON to Lucide components
const navIconMap: Record<string, LucideIcon> = {
  handshake: Handshake,
  mappin: MapPin,
  monitor: Monitor,
  globe: Globe,
  circledot: CircleDot,
  share2: Share2,
  palette: Palette,
  megaphone: Megaphone,
  dollarsign: DollarSign,
  tv: Tv,
  target: Target,
  music: Music,
  award: Award,
}

// --- Types ---

export interface NavItem {
  title: string
  href: string
  description?: string
  icon?: LucideIcon
}

export interface NavLink {
  type: 'link'
  title: string
  href: string
}

export interface NavDropdown {
  type: 'dropdown'
  title: string
  /** Optional: makes the top-level label a clickable link (e.g. About Us → /about-us). */
  href?: string
  items: NavItem[]
}

export interface NavMegaMenu {
  type: 'megamenu'
  title: string
  href?: string
  sections: {
    label: string
    items: NavItem[]
  }[]
  featured?: {
    title: string
    description: string
    href: string
    image?: string
    bgColor?: string
  }[]
}

export type DynamicNavItem = NavLink | NavDropdown | NavMegaMenu

// --- Helpers ---

function resolveIcon(iconName?: string): LucideIcon | undefined {
  if (!iconName) return undefined
  return navIconMap[iconName.toLowerCase()]
}

function resolveNavItems(items: { title: string; description?: string; href: string; icon?: string }[]): NavItem[] {
  return items.map(item => ({
    ...item,
    icon: resolveIcon(item.icon),
  }))
}

// --- Build dynamic navItems from JSON ---

function parseNavItems(raw: any[]): DynamicNavItem[] {
  return raw.map(item => {
    if (item.type === 'link') {
      return { type: 'link' as const, title: item.title, href: item.href }
    }
    if (item.type === 'dropdown') {
      return {
        type: 'dropdown' as const,
        title: item.title,
        href: item.href,
        items: resolveNavItems(item.items || []),
      }
    }
    if (item.type === 'megamenu') {
      return {
        type: 'megamenu' as const,
        title: item.title,
        href: item.href,
        sections: (item.sections || []).map((s: any) => ({
          label: s.label,
          items: resolveNavItems(s.items || []),
        })),
        featured: (item.featured || []).map((f: any) => ({
          title: f.title,
          description: f.description ?? '',
          href: f.href,
          image: f.thumbnail ?? f.image,
        })),
      }
    }
    // Fallback: treat as link
    return { type: 'link' as const, title: 'Unknown', href: '#' }
  })
}

export const navItems: DynamicNavItem[] = parseNavItems(navbarJson.navItems ?? [])

// CTA Button
const defaultCtaButton = { text: "Contact Us", href: "/contact-us" }
const rawCtaButton = navbarJson.ctaButton ?? defaultCtaButton
export const ctaButton = {
  text: rawCtaButton.text ?? defaultCtaButton.text,
  href: rawCtaButton.href ?? defaultCtaButton.href,
}

// --- Footer config ---

export interface FooterLinksColumn {
  type: 'links'
  title: string
  links: { label: string; href: string }[]
}

export interface FooterAccordionColumn {
  type: 'accordion'
  title: string
  href?: string
  sections: {
    label: string
    items: { label: string; href: string }[]
  }[]
}

export type FooterColumn = FooterLinksColumn | FooterAccordionColumn

const defaultFooter = {
  description: "Your trusted partner for comprehensive digital marketing solutions.",
  columns: [] as FooterColumn[],
  bottomLinks: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
}

export const footerConfig = {
  description: footerJson.description ?? defaultFooter.description,
  columns: (footerJson.columns ?? defaultFooter.columns) as FooterColumn[],
  bottomLinks: footerJson.bottomLinks ?? defaultFooter.bottomLinks,
}
