// ===========================================
// PHOTO CREDITS
// Third-party photos used on the site. Rendered in the footer by
// PhotoCredits.astro. CC BY / CC BY-SA licenses require title, author,
// source, license and any changes made — keep every field filled in.
// ===========================================

export interface PhotoCredit {
  title: string
  author: string
  authorUrl?: string
  source: string
  sourceUrl: string
  license: string
  licenseUrl: string
  changes?: string
  usedOn: string
}

export const photoCredits: PhotoCredit[] = [
  {
    title: "Atlanta skyline from Jackson Street Bridge 2020",
    author: "Marc Merlin",
    source: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Atlanta_skyline_from_Jackson_Street_Bridge_2020.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    changes: "resized",
    usedOn: "home hero, CTA background (public/images/atlanta-skyline.avif, src/assets/images/atlanta-skyline.avif)",
  },
  {
    title: "Jackson Street Bridge and Atlanta Night Skyline",
    author: "Joey Kyber",
    authorUrl: "https://unsplash.com/@jtkyber1",
    source: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Jackson_Street_Bridge_and_Atlanta_Night_Skyline_(Unsplash).jpg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    changes: "resized",
    usedOn: "popup (public/images/atlanta-skyline-night.avif)",
  },
]
