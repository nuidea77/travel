<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\Tour;
use App\Models\TourCategory;
use Illuminate\Database\Seeder;

class TourSeeder extends Seeder
{
    /**
     * All tour content is imported verbatim from the company's own site
     * (mmongolia.com) via database/data/mmongolia.json:
     * titles, intros, day-by-day itineraries (from the published PDF
     * itineraries where available), services, 2026 group departures and
     * group prices. Private tours carry no public price (price_from = 0,
     * shown as "price on request").
     */
    public function run(): void
    {
        $data = json_decode(file_get_contents(database_path('data/mmongolia.json')), true);

        $categories = TourCategory::pluck('id', 'slug');
        $destinations = Destination::pluck('id', 'slug');

        foreach ($data['tours'] as $i => $t) {
            $tour = Tour::create([
                'title' => $t['title'],
                'slug' => $t['slug'],
                'excerpt' => $t['excerpt'],
                'overview' => $t['overview'] ?: null,
                'type' => $t['type'],
                'duration_days' => $t['duration_days'],
                'price_from' => $t['price_from'],
                'rating' => 5.0,
                'reviews_count' => 0,
                'image' => $t['image'],
                'highlights' => $t['highlights'] ?: null,
                'included' => $t['included'] ?: null,
                'excluded' => $t['excluded'] ?: null,
                'good_to_know' => null,
                'is_featured' => $t['is_featured'],
                'is_best_seller' => $t['is_best_seller'],
                'is_published' => true,
                'sort_order' => $i,
            ]);

            $tour->categories()->sync(
                collect($t['categories'])->map(fn ($slug) => $categories[$slug] ?? null)->filter()->all()
            );
            $tour->destinations()->sync(
                collect($t['destinations'])->map(fn ($slug) => $destinations[$slug] ?? null)->filter()->all()
            );

            foreach ($t['itinerary'] as $day) {
                $tour->itineraryDays()->create([
                    'day_number' => $day['day_number'],
                    'title' => $day['title'],
                    'description' => $day['description'],
                    'meals' => $day['meals'],
                    'distance' => $day['distance'],
                    'map_label' => $day['map_label'] ?? null,
                    'lat' => $day['lat'] ?? null,
                    'lng' => $day['lng'] ?? null,
                ]);
            }

            foreach ($t['departures'] as $dep) {
                $tour->departures()->create([
                    'start_date' => $dep['start_date'],
                    'end_date' => $dep['end_date'],
                    'price' => $dep['price'],
                    'seats_total' => 16,
                    'seats_left' => 16,
                    'status' => 'open',
                ]);
            }
        }
    }
}
