import type {
  Departure,
  HomePayload,
  Page,
  Paginated,
  Post,
  PostCategory,
  Settings,
  Testimonial,
  Tour,
  TourFilterOptions,
} from "~/types";

export const DEFAULT_SETTINGS: Settings = {
  site_name: "Magnificent Mongolia",
  tagline: "Authentic Mongolian tours across all five regions of the country",
  logo_tagline: "Authentic Mongolian Tours",
  hero_title: "Explore The Majestic Mongolia Landscape Now",
  hero_image: "/images/hero.jpg",
  phone: "+976 9991-9363",
  whatsapp: "+976 9991-9363",
  email: "info@mmongolia.com",
  address: "Ulaanbaatar, Mongolia",
  founded_year: "2017",
  socials: {},
  stats: [],
};

const EMPTY_PAGE: Paginated<never> = {
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: 12,
  total: 0,
};

/** GET an API path, degrading to a fallback when the backend is unreachable. */
export async function apiGet<T>(path: string, fallback: T): Promise<T> {
  const base = useRuntimeConfig().public.apiBase;
  try {
    return await $fetch<T>(`${base}${path}`, {
      headers: { Accept: "application/json" },
    });
  } catch {
    return fallback;
  }
}

export const getSettings = () => apiGet<Settings>("/settings", DEFAULT_SETTINGS);

export const getHome = () =>
  apiGet<HomePayload>("/home", {
    featured_tours: [],
    best_sellers: [],
    categories: [],
    destinations: [],
    testimonials: [],
    latest_posts: [],
    post_categories: [],
  });

export const getTours = (qs = "") =>
  apiGet<Paginated<Tour>>(`/tours${qs ? `?${qs}` : ""}`, EMPTY_PAGE);

export const getTour = (slug: string) => apiGet<Tour | null>(`/tours/${slug}`, null);

export const getTourFilters = () =>
  apiGet<TourFilterOptions>("/tour-filters", {
    categories: [],
    destinations: [],
    durations: [],
    types: [],
  });

export const getDepartures = () => apiGet<Departure[]>("/departures", []);

export const getPosts = (qs = "") =>
  apiGet<Paginated<Post>>(`/posts${qs ? `?${qs}` : ""}`, EMPTY_PAGE);

export const getPost = (slug: string) => apiGet<Post | null>(`/posts/${slug}`, null);

export const getPostCategories = () => apiGet<PostCategory[]>("/post-categories", []);

export const getTestimonials = () => apiGet<Testimonial[]>("/testimonials", []);

export const getPage = (slug: string) => apiGet<Page | null>(`/pages/${slug}`, null);

export async function postJson(
  path: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; message: string }> {
  const base = useRuntimeConfig().public.apiBase;
  try {
    const json = await $fetch<{ message?: string }>(`${base}${path}`, {
      method: "POST",
      body,
      headers: { Accept: "application/json" },
    });
    return { ok: true, message: json.message ?? "Success" };
  } catch (error: unknown) {
    const message =
      (error as { data?: { message?: string } })?.data?.message ??
      "Could not reach the server. Please try again.";
    return { ok: false, message };
  }
}

/** Site settings shared across layout + pages (fetched once in app.vue). */
export const useSettings = () =>
  useState<Settings>("settings", () => DEFAULT_SETTINGS);

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
