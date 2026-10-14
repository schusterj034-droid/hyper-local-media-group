# Product Overview

A CMS-driven marketing website template for local businesses/dealers. Built with Astro and Pages CMS, it enables non-technical users to manage pages, sections, and site settings through a visual admin interface.

## Core Features
- Dynamic page builder with modular sections (Hero, Features, CTA, FAQ, Contact, etc.)
- Location-based pages for multi-location businesses
- Site-wide settings management (branding, contact info, SEO, social links)
- Popup modal system for promotions
- SEO-optimized with structured data (JSON-LD)

## Target Users
- Marketing agencies managing dealer/franchise websites
- Local businesses needing customizable landing pages
- Content editors who need a visual CMS interface

## Content Model
- Pages are composed of reusable section blocks
- Sections use `{ type: 'hero', ...props }` format (flat, no wrapper)
- All content stored as JSON in `src/content/`
- Settings centralized in `src/content/settings/`
- CMS config at `.pages.yml` (repo root)
- CMS accessible at https://app.pagescms.org
