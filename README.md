# Nomad Horizons — Mongolia Travel Website

A fully dynamic travel-agency website modeled on [discovermongolia.mn](https://www.discovermongolia.mn/),
built as a decoupled two-app stack:

| Directory   | Stack                                             | Role                                        |
|-------------|---------------------------------------------------|---------------------------------------------|
| `backend/`  | **Laravel 13** + SQLite + **Filament 5** admin    | REST API + content management panel         |
| `frontend/` | **Next.js 14** (App Router) + Tailwind CSS        | Public website, server-rendered from the API |

Everything on the public site — tours, itineraries, group-size prices, departure
dates, blog posts, testimonials, static pages, contact details, social links,
even the homepage stats — lives in the database and is editable from the admin
panel. No content is hard-coded.

## Features

**Public site (`frontend/`)**
- Homepage: hero, trust stats, private-vs-group comparison, featured tours,
  testimonial carousel, travel-guide hub, "why us" grid, CTA band
- `/tours` with live filters (join/private, theme, duration, destination),
  search, sorting and pagination — all URL-driven and server-rendered
- `/tours/[slug]`: overview, highlights, day-by-day itinerary accordion,
  group-size price table, upcoming departures, included/excluded,
  good-to-know, per-tour reviews, related tours and a working booking form
- `/trip-calendar`: all upcoming departures grouped by month
- `/blogs` + `/blogs/[slug]` with category filters and related articles
- `/about-mongolia` (country guide + destination grid), `/about-us`,
  `/car-rental` (DB-driven pages), `/contact` (working form)
- All imagery is a locally generated SVG illustration set
  (`frontend/scripts/generate-images.mjs`) — no external image dependencies

**API (`backend/`)** — all under `/api`:
`GET /home`, `GET /tours` (filters: `type, category, destination, duration,
search, sort, page`), `GET /tours/{slug}`, `GET /tour-filters`,
`GET /departures`, `GET /posts`, `GET /posts/{slug}`, `GET /post-categories`,
`GET /testimonials`, `GET /pages/{slug}`, `GET /settings`,
`POST /bookings`, `POST /contact`

**Admin panel** — Filament at `/admin` with CRUD for tours, itinerary days,
prices, departures, categories, destinations, posts, testimonials, pages,
settings, and inboxes for bookings and contact messages.

## Quick start

Requirements: PHP ≥ 8.3, Composer, Node ≥ 20.

### 1. Backend (Laravel API + admin)

```bash
cd backend
composer install
cp .env.example .env         # SQLite is the default connection
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed   # seeds 14 tours, blogs, reviews, pages, settings
php artisan serve            # http://localhost:8000
```

Admin panel: <http://localhost:8000/admin> — login `admin@example.com` /
`password` (change it after first login).

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev                  # http://localhost:3000
```

For production: `npm run build && npm start`.

### Түргэн эхлүүлэх (Монгол)

1. `backend/` дотор: `composer install`, `cp .env.example .env`,
   `php artisan key:generate`, `touch database/database.sqlite`,
   `php artisan migrate --seed`, дараа нь `php artisan serve`.
2. `frontend/` дотор: `npm install`, `cp .env.example .env.local`,
   `npm run dev`.
3. Сайт: <http://localhost:3000> · Админ: <http://localhost:8000/admin>
   (`admin@example.com` / `password`).

Бүх контент (аялал, хөтөлбөр, үнэ, блог, сэтгэгдэл, тохиргоо) админ панелээс
удирдагдана. Сайтын нэр, утас, имэйл, сошиал холбоосыг **Settings** хэсгээс
солино.

## Content & branding

- Site name, tagline, phone, WhatsApp, email, address, socials and homepage
  stats live in the `settings` table (Admin → Settings) and are consumed by
  the frontend on every request.
- Tour/blog/page imagery references the SVG set in `frontend/public/images`.
  Regenerate or extend it with `node frontend/scripts/generate-images.mjs`,
  and the admin image pickers list the same set
  (`backend/app/Filament/Support/SiteImages.php`).
- Swap the SVGs for real photos at the same paths (or extend the picker) when
  photography is available.

## Architecture notes

- The frontend renders every page dynamically (`force-dynamic`) and fetches
  the API with `cache: "no-store"`, so admin edits appear on the next page
  load — no rebuilds needed. If the API is unreachable, pages degrade to
  empty states instead of crashing (useful during `next build`).
- CORS for `/api/*` is open by default via Laravel's framework defaults;
  restrict `allowed_origins` before production.
- Bookings and contact messages are stored via the API and triaged in the
  admin panel (statuses: new / contacted / confirmed / cancelled).
