# Magnificent Mongolia — Travel Website

A fully dynamic travel-agency website modeled on [discovermongolia.mn](https://www.discovermongolia.mn/),
built as a decoupled two-app stack:

| Directory | Stack                                      | Role                                          |
|-----------|--------------------------------------------|-----------------------------------------------|
| `/` (root)| **Laravel 13** + SQLite                    | REST API + custom admin API (token auth)      |
| `nuxt/`   | **Vue 3 / Nuxt 4** + Tailwind CSS          | Public website **and admin panel** (`/admin`), server-rendered from the API |

Everything on the public site — tours, itineraries, group-size prices, departure
dates, blog posts, testimonials, static pages, contact details, social links,
even the homepage stats — lives in the database and is editable from the admin
panel. No content is hard-coded.

## Features

**Public site (`nuxt/`)**
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

**Admin panel** — our own Vue admin at `/admin` (inside the Nuxt app) with a
token-authenticated admin API (`/api/admin/*`): dashboard, full tour editor
(itinerary / price tiers / departures repeaters, category & destination
pickers), blog posts, categories, destinations, testimonials, pages, site
settings, and inboxes for bookings and contact messages.

## Quick start

Requirements: PHP ≥ 8.3, Composer, Node ≥ 20, MySQL 8+ (or MariaDB 10.6+).

### 1. Backend (Laravel API + admin)

```bash
composer install
cp .env.example .env         # MySQL is the default connection
php artisan key:generate

# create the database, then set DB_DATABASE / DB_USERNAME / DB_PASSWORD in .env
mysql -u root -e "CREATE DATABASE mmongolia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

php artisan migrate --seed   # seeds 33 tours, blogs, reviews, pages, settings
php artisan serve            # http://localhost:8000
```

> Prefer a zero-setup database? Set `DB_CONNECTION=sqlite` in `.env` and run
> `touch database/database.sqlite` instead of creating a MySQL database.

The admin panel lives in the Nuxt app: <http://localhost:3000/admin> —
login `admin@example.com` / `password` (change it after first login).

### 2. Frontend (Vue 3 / Nuxt)

```bash
cd nuxt
npm install
cp .env.example .env         # NUXT_PUBLIC_API_BASE=http://localhost:8000/api
npm run dev                  # http://localhost:3000
```

For production: `npm run build && node .output/server/index.mjs`
(or `npm run preview`; set `PORT=3000` to choose the port).

### Түргэн эхлүүлэх (Монгол)

1. Root дотор: `composer install`, `cp .env.example .env`,
   `php artisan key:generate`. MySQL-д `mmongolia` нэртэй сан үүсгээд
   `.env`-ийн `DB_DATABASE / DB_USERNAME / DB_PASSWORD`-оо тохируулна.
   Дараа нь `php artisan migrate --seed`, тэгээд `php artisan serve`.
2. `nuxt/` дотор: `npm install`, `cp .env.example .env`, `npm run dev`.
3. Сайт: <http://localhost:3000> · Админ: <http://localhost:3000/admin>
   (`admin@example.com` / `password`).

Бүх контент (аялал, хөтөлбөр, үнэ, блог, сэтгэгдэл, тохиргоо) админ панелээс
удирдагдана. Сайтын нэр, утас, имэйл, сошиал холбоосыг **Settings** хэсгээс
солино.

## Content & branding

- Site name, tagline, phone, WhatsApp, email, address, socials and homepage
  stats live in the `settings` table (Admin → Settings) and are consumed by
  the frontend on every request.
- Tour/blog/page imagery references the SVG set in `nuxt/public/images`.
  Regenerate or extend it with `node nuxt/scripts/generate-images.mjs`,
  and the admin image pickers list the same set
  (`app/Support/SiteImages.php`).
- Swap the SVGs for real photos at the same paths (or extend the picker) when
  photography is available.

## Architecture notes

- The frontend is a Nuxt (Vue 3) app that server-renders every page and
  fetches the API per request (`useAsyncData` + `$fetch`), so admin edits
  appear on the next page load — no rebuilds needed. If the API is
  unreachable, pages degrade to empty states instead of crashing (useful
  during `npm run build`).
- The database is MySQL (utf8mb4); every content table is plain Laravel
  migrations, so MariaDB 10.6+ works identically, and SQLite remains usable
  for quick local experiments (`DB_CONNECTION=sqlite`).
- CORS for `/api/*` is open by default via Laravel's framework defaults;
  restrict `allowed_origins` before production.
- Bookings and contact messages are stored via the API and triaged in the
  admin panel (statuses: new / contacted / confirmed / cancelled).
