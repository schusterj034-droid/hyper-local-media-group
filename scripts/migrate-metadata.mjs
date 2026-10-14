#!/usr/bin/env node
// Bulk-set metadata blocks on every page JSON + strip AI tells.
// Per TEMPLATE_STRUCTURE_GUIDE.md section 5 table.
// Single-brace token style ({city}/{business}/{state}/{location}).
// Pages use `title`/`description`/`keywords` at top level (no metadata wrapper).

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { resolve, join } from "path";

const ROOT = resolve(process.cwd());
const PAGES_DIR = join(ROOT, "src/content/pages");
const LOCATIONS_DIR = join(PAGES_DIR, "locations");

// Per-slug metadata table mapped to dynamic-grid's URL conventions
const PAGE_META = {
  "index": {
    title: "{city} Digital Signage & Marketing | {business}",
    description:
      "We connect businesses in {city} through digital signage, PPC, social media, SEO, and website design to keep brands visible and top of mind.",
  },
  "about": {
    title: "About {business} | Local Business Branding",
    description:
      "Discover how we help businesses stay top of mind where customers eat, work, live, and play through signage and digital marketing.",
  },
  "contact": {
    title: "{business} | Digital Signage & Marketing",
    description:
      "Contact {business} to learn how our digital signage, SEO, PPC, social media, and website solutions help businesses stay visible and top of mind.",
  },
  "screen-advertising": {
    title: "High-Traffic Digital Billboard Advertising Network",
    description:
      "Promote your business across our high-traffic digital signage network with ads displayed thousands of times to repeat local customers.",
  },
  "venue-partner": {
    title: "Join Our Indoor Billboard Advertising Network",
    description:
      "Host a digital billboard in your business and gain exposure across our growing advertising network reaching customers where they eat, work, live, and play.",
  },
  "locations": {
    title: "Indoor Billboard Locations in {city} | {business}",
    description:
      "See where your ads could appear across our indoor digital billboard network in {city}, including high-traffic restaurants, bars, gyms, & venues.",
  },
  "ppc": {
    title: "Pay Per Click Advertising | Drive Traffic & Sales",
    description:
      "Drive more conversions with expert PPC services. Google Ads, retargeting & optimization on every click to boost exposure and eliminate wasted ad spend.",
  },
  "social-media-advertising": {
    title: "Social Media Advertising | Targeted Ads That Convert",
    description:
      "Reach your audience on Facebook, Instagram & more with data-driven social media advertising. Drive traffic, leads & revenue with strategic campaigns.",
  },
  "streaming-audio": {
    title: "Digital Audio Advertising | Targeted Streaming Ads",
    description:
      "Reach listeners with streaming audio ads on music and podcast platforms. Non-skippable, professionally produced ads that build awareness and drive action.",
  },
  "connected-tv": {
    title: "Connected TV Advertising | Reach Streaming Audiences",
    description:
      "Elevate your brand with high-quality ads delivered to the right audience on top streaming platforms.",
  },
  "geofencing": {
    title: "Display Geofencing Ads | Hyper-Targeted Local Marketing",
    description:
      "Reach customers based on where they go. Our geofencing ads deliver precise location-based targeting.",
  },
  "design-services": {
    title: "Creative Design Services | Branding That Stands Out",
    description:
      "Elevate your brand with custom design solutions tailored to your business goals and needs.",
  },
  "google-business": {
    title: "Google Business Profile Optimization | {business}",
    description:
      "Stand out in local search and maps in {city}. We optimize and manage your profile to drive traffic, calls, and customers.",
  },
  "social-media-management": {
    title: "Social Media Management | Grow Your Brand & Engagement",
    description:
      "Build a strong online presence with expert social media management that drives engagement and brand awareness.",
  },
  "website-design": {
    title: "SEO-Friendly Website Design for Local Businesses",
    description:
      "We design modern, SEO-friendly websites that help businesses build credibility, improve visibility, and convert visitors into customers.",
  },
  "solutions": {
    title: "Digital Marketing Solutions | Full-Service Marketing Agency",
    description:
      "Explore our suite of digital marketing, including indoor billboards, website design, social media, & PPC, to grow your business with proven results.",
  },
  "privacy": {
    title: "Privacy Policy",
    description:
      "Read the {business} Privacy Policy to learn how we collect, use, and protect your personal information when you visit and interact with our website.",
  },
  "terms": {
    title: "Terms of Service",
    description:
      "Review the {business} Terms of Service covering acceptable use of our website, intellectual property, third-party services, and your responsibilities.",
  },
};

const LOCATION_META = {
  title: "{location} {state} Digital Signage & Marketing | {business}",
  description:
    "We connect businesses in {location}, {state} through digital signage, PPC, social media, SEO, and website design to keep brands visible and top of mind.",
};

const REPLACE = [
  [/—/g, ", "],
  [/–/g, ", "],
  // " - " (space-hyphen-space) used as dash separator is an AI tell. Replace with comma.
  [/ - /g, ", "],
  [/\(PPC\)/g, ""],
  [/\(OTT\)/g, ""],
  [/\(CTV\)/g, ""],
  [/\(SMA\)/g, ""],
  [/\(SMM\)/g, ""],
  [/\(SEO\)/g, ""],
  [/\(OTT Ads\)/g, ""],
  [/\(Geofencing\)/g, ""],
  [/\bROI\b/g, "exposure"],
  [/return on investment/gi, "exposure"],
  [/Elevate your brand/gi, "Stand out"],
  [/Unleash the Power of /g, ""],
  [/Unleash /g, ""],
  [/Your trusted partner/gi, "Local team"],
  [/In today's digital landscape, /g, ""],
  [/Seamless integration/gi, "works with"],
  [/Cutting-edge /gi, ""],
  [/\s+,/g, ","],
  [/\s+\./g, "."],
  [/ {2,}/g, " "],
];

function scrub(s) {
  if (typeof s !== "string") return s;
  let out = s;
  for (const [re, val] of REPLACE) out = out.replace(re, val);
  return out;
}

function walk(node, fn) {
  if (typeof node === "string") return fn(node);
  if (Array.isArray(node)) return node.map((n) => walk(n, fn));
  if (node && typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = walk(v, fn);
    return out;
  }
  return node;
}

function processPageJson(file, slug) {
  const raw = readFileSync(file, "utf-8");
  let data = JSON.parse(raw);
  data = walk(data, scrub);

  const meta = PAGE_META[slug];
  if (meta) {
    data.title = meta.title;
    data.description = meta.description;
  }
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`✓ ${slug}`);
}

function processLocationJson(file, slug) {
  const raw = readFileSync(file, "utf-8");
  let data = JSON.parse(raw);
  data = walk(data, scrub);
  data.title = LOCATION_META.title;
  data.description = LOCATION_META.description;
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`✓ location: ${slug}`);
}

for (const f of readdirSync(PAGES_DIR)) {
  const full = join(PAGES_DIR, f);
  if (!statSync(full).isFile() || !f.endsWith(".json")) continue;
  const slug = f.replace(/\.json$/, "");
  processPageJson(full, slug);
}

for (const f of readdirSync(LOCATIONS_DIR)) {
  if (!f.endsWith(".json")) continue;
  processLocationJson(join(LOCATIONS_DIR, f), f.replace(/\.json$/, ""));
}

console.log("Done.");
