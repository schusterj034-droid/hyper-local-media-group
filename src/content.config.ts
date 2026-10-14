import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// Pages (JSON) - managed by Pages CMS
const pages = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string().optional(),
    name: z.string().optional(),
    city: z.string().optional(),
    description: z.string(),
    keywords: z.string().optional(),
    sections: z.array(z.any()).optional(),
    legalSections: z.array(z.any()).optional(),
  }).passthrough(),
})

// Settings (JSON)
const settings = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/settings" }),
  schema: z.any(),
})

export const collections = { 
  pages,
  settings,
}
