// @ts-nocheck — rolldown-vite + @tailwindcss/vite + dual-vite-version type collisions
import { defineConfig, fontProviders } from "astro/config";
import { readFileSync } from "fs";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

const siteJsonAbsolute = resolve("./src/content/settings/site.json");
const siteData = JSON.parse(readFileSync(siteJsonAbsolute, "utf-8"));

/** @param {string | undefined | null} u */
function normalizeUrl(u) {
  if (!u) return null;
  const t = String(u).trim();
  if (!t) return null;
  const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  return withProto.replace(/\/+$/, "");
}

const SETTINGS_URL = normalizeUrl(siteData.seo?.siteUrl);
const PLACEHOLDER =
  !SETTINGS_URL ||
  /example\.com$/.test(SETTINGS_URL) ||
  /\.vercel\.app$/.test(SETTINGS_URL);

const SITE_URL =
  normalizeUrl(process.env.PUBLIC_SITE_URL) ||
  normalizeUrl(process.env.SITE_URL) ||
  (PLACEHOLDER
    ? normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
      normalizeUrl(process.env.VERCEL_URL) ||
      SETTINGS_URL
    : SETTINGS_URL) ||
  "https://example.com";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: "static",
  adapter: vercel(),

  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes("/privacy") && !page.includes("/terms"),
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],

  fonts: [
    {
      provider: fontProviders.local(),
      name: "Poppins",
      cssVariable: "--font-poppins",
      fallbacks: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/Poppins-Regular.woff2"],
            weight: 400,
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/Poppins-Bold.woff2"],
            weight: 700,
            style: "normal",
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: { "@": "/src" },
      // rolldown-vite (Astro 6 default) needs this until @tailwindcss/vite ships a compatible release
      tsconfigPaths: false,
    },
    build: {
      cssMinify: "lightningcss",
      minify: "esbuild",
      target: "esnext",
      cssCodeSplit: true,
    },
  },

  compressHTML: true,

  build: {
    inlineStylesheets: "always",
    assets: "_astro",
  },

  experimental: {
    contentIntellisense: true,
  },

  prefetch: false,
});
