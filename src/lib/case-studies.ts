// ============================================
// Case Studies — thin data layer
//
// Fetches this deploy's PUBLISHED case studies from the shared NTV Edge
// Function. NO Supabase key ships here — the function queries with the anon
// role server-side and returns only published, public fields.
//
//   GET  <API>?client=<slug>
//   →  { client: { id, slug, name, logo_url } | null, studies: CaseStudy[] }
//
// Config (optional, via .env):
//   PUBLIC_CLIENT_SLUG        — which client's studies to show (default "ntv360")
//   PUBLIC_CASE_STUDIES_API   — override the endpoint (defaults to the NTV fn)
// ============================================

/** One stat callout, e.g. { value: "51.1%", label: "Increase in GBP Views" }. */
export interface Stat {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: string;
  client_id: string;

  slug: string;
  title: string;
  category: string | null;

  thumbnail_url: string | null;
  client_logo_url: string | null;
  hero_image_url: string | null;
  website_url: string | null;

  industry: string | null;
  challenge_summary: string | null;
  results_summary: string | null;

  stats: Stat[];

  about_business: string | null;
  challenge_body: string | null;
  solution_body: string | null;
  results_body: string | null;

  gallery: string[];

  published: boolean;
  sort_order: number;

  created_at: string;
  updated_at: string;
}

export interface CaseStudiesClient {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
}

interface ApiPayload {
  client: CaseStudiesClient | null;
  studies: CaseStudy[];
}

const CLIENT_SLUG = (import.meta.env.PUBLIC_CLIENT_SLUG as string) || "ntv360";
const API_BASE =
  (import.meta.env.PUBLIC_CASE_STUDIES_API as string) ||
  "https://swluvugjmdeawawvisql.functions.supabase.co/case-studies";

// One fetch per build/request, memoized so the grid + filter + detail paths
// don't each hit the network. Studies come back already sorted + published.
let _cache: Promise<ApiPayload> | null = null;

function fetchPayload(): Promise<ApiPayload> {
  if (_cache) return _cache;
  const url = `${API_BASE}?client=${encodeURIComponent(CLIENT_SLUG)}`;
  _cache = fetch(url)
    .then(async (res) => {
      if (!res.ok) throw new Error(`Case studies API ${res.status}: ${await res.text()}`);
      const data = (await res.json()) as ApiPayload;
      return {
        client: data.client ?? null,
        studies: Array.isArray(data.studies)
          ? data.studies.map((cs) => ({
              ...cs,
              stats: Array.isArray(cs.stats) ? cs.stats : [],
              gallery: Array.isArray(cs.gallery) ? cs.gallery : [],
            }))
          : [],
      };
    })
    .catch((err) => {
      // Don't break the build if the API is briefly unreachable — render empty.
      console.warn(`[case-studies] ${err instanceof Error ? err.message : err}`);
      return { client: null, studies: [] };
    });
  return _cache;
}

/**
 * List published case studies, newest sort_order first.
 * Optional category filter (omit or pass "All" for no filter).
 */
export async function listCaseStudies(
  options: { category?: string } = {},
): Promise<CaseStudy[]> {
  const { studies } = await fetchPayload();
  if (options.category && options.category !== "All") {
    return studies.filter((cs) => cs.category === options.category);
  }
  return studies;
}

/** Distinct, sorted, non-empty category names — for the grid's filter pills. */
export async function getCategories(): Promise<string[]> {
  const { studies } = await fetchPayload();
  const set = new Set<string>();
  for (const cs of studies) {
    if (cs.category && cs.category.trim()) set.add(cs.category.trim());
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Get one published case study by its slug (this client), or null. */
export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const { studies } = await fetchPayload();
  return studies.find((cs) => cs.slug === slug) ?? null;
}

/** The resolved client row (name/logo), or null if the slug isn't found. */
export async function getCaseStudiesClient(): Promise<CaseStudiesClient | null> {
  const { client } = await fetchPayload();
  return client;
}
