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
} from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      // The site is fully dynamic: always render with fresh data.
      cache: "no-store",
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    // Backend not reachable (e.g. during `next build`) — degrade gracefully.
    return fallback;
  }
}

export const DEFAULT_SETTINGS: Settings = {
  site_name: "Nomad Horizons",
  tagline: "Private journeys & small group tours across Mongolia",
  phone: "+976 7000-0000",
  whatsapp: "+976 8800-0000",
  email: "hello@nomadhorizons.example",
  address: "Peace Avenue, Ulaanbaatar, Mongolia",
  founded_year: "2004",
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

export const getSettings = () =>
  get<Settings>("/settings", DEFAULT_SETTINGS);

export const getHome = () =>
  get<HomePayload>("/home", {
    featured_tours: [],
    best_sellers: [],
    categories: [],
    destinations: [],
    testimonials: [],
    latest_posts: [],
    post_categories: [],
  });

export const getTours = (params: URLSearchParams | string = "") => {
  const qs = params.toString();
  return get<Paginated<Tour>>(`/tours${qs ? `?${qs}` : ""}`, EMPTY_PAGE);
};

export const getTour = (slug: string) =>
  get<Tour | null>(`/tours/${slug}`, null);

export const getTourFilters = () =>
  get<TourFilterOptions>("/tour-filters", {
    categories: [],
    destinations: [],
    durations: [],
    types: [],
  });

export const getDepartures = (year?: number) =>
  get<Departure[]>(`/departures${year ? `?year=${year}` : ""}`, []);

export const getPosts = (params: URLSearchParams | string = "") => {
  const qs = params.toString();
  return get<Paginated<Post>>(`/posts${qs ? `?${qs}` : ""}`, EMPTY_PAGE);
};

export const getPost = (slug: string) => get<Post | null>(`/posts/${slug}`, null);

export const getPostCategories = () =>
  get<PostCategory[]>("/post-categories", []);

export const getTestimonials = () => get<Testimonial[]>("/testimonials", []);

export const getPage = (slug: string) => get<Page | null>(`/pages/${slug}`, null);

export async function postJson<T>(
  path: string,
  body: unknown,
): Promise<{ ok: boolean; message: string; errors?: Record<string, string[]>; data?: T }> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        message: json.message ?? "Something went wrong. Please try again.",
        errors: json.errors,
      };
    }
    return { ok: true, message: json.message ?? "Success", data: json.data };
  } catch {
    return { ok: false, message: "Could not reach the server. Please try again." };
  }
}
