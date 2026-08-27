export interface TourCategory {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  tours_count?: number;
}

export interface Destination {
  id: number;
  name: string;
  slug: string;
  region: string | null;
  description: string | null;
  image: string | null;
  tours_count?: number;
}

export interface ItineraryDay {
  id: number;
  day_number: number;
  title: string;
  description: string;
  meals: string | null;
  accommodation: string | null;
  distance: string | null;
}

export interface TourPrice {
  id: number;
  min_people: number;
  max_people: number;
  price: string | number;
}

export interface Departure {
  id: number;
  tour_id: number;
  start_date: string;
  end_date: string;
  price: string | number | null;
  seats_total: number;
  seats_left: number;
  status: "open" | "guaranteed" | "full";
  tour?: Tour;
}

export interface Tour {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  overview: string | null;
  type: "join" | "private";
  duration_days: number;
  price_from: string | number;
  rating: string | number;
  reviews_count: number;
  image: string | null;
  highlights: string[] | null;
  included: string[] | null;
  excluded: string[] | null;
  good_to_know: { title: string; body: string }[] | null;
  is_featured: boolean;
  is_best_seller: boolean;
  categories?: TourCategory[];
  destinations?: Destination[];
  itinerary_days?: ItineraryDay[];
  prices?: TourPrice[];
  departures?: Departure[];
  testimonials?: Testimonial[];
  related?: Tour[];
}

export interface PostCategory {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  posts_count?: number;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image: string | null;
  author: string;
  read_time: number;
  published_at: string;
  category?: PostCategory;
  related?: Post[];
}

export interface Testimonial {
  id: number;
  name: string;
  country: string;
  rating: number;
  title: string;
  body: string;
  travelled_at: string | null;
  tour?: { id: number; title: string; slug: string } | null;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  subtitle: string | null;
  body: string;
  image: string | null;
}

export interface Settings {
  site_name: string;
  legal_name?: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  founded_year: string;
  socials: Record<string, string>;
  stats: { label: string; value: string }[];
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface HomePayload {
  featured_tours: Tour[];
  best_sellers: Tour[];
  categories: TourCategory[];
  destinations: Destination[];
  testimonials: Testimonial[];
  latest_posts: Post[];
  post_categories: PostCategory[];
}

export interface TourFilterOptions {
  categories: TourCategory[];
  destinations: Destination[];
  durations: { value: string; label: string }[];
  types: { value: string; label: string }[];
}
