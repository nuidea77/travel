<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\PostCategory;
use App\Models\TourCategory;
use Illuminate\Database\Seeder;

class TaxonomySeeder extends Seeder
{
    /**
     * Tour categories and destinations are imported from the company's
     * own site (mmongolia.com) via database/data/mmongolia.json.
     */
    public function run(): void
    {
        $data = json_decode(file_get_contents(database_path('data/mmongolia.json')), true);

        $categoryDescriptions = [
            'discovery' => 'Classic multi-region journeys linking the Gobi, the Khangai heartland and the northern lakes.',
            'adventure-overland' => 'Long expedition routes for travelers who want to cross the country the hard, glorious way.',
            'horse-riding' => 'Multi-day rides with wranglers and pack support — the steppe as it is meant to be seen.',
            'hiking-trekking' => 'Volcano rims, dune crests, gorge trails and the high Altai on foot.',
            'sightseeing-cultural' => 'Monasteries, museums, nomad family visits and the living heritage of the empire.',
            'festival-events' => 'Naadam, the Golden Eagle Festival, ice, camel and yak festivals — timed to the day.',
            'wildlife-photography' => 'Takhi horses, reindeer camps, eagle hunters and golden-hour landscapes for your lens.',
            'winter' => 'The white season: ice festivals, frozen lakes and gers glowing warm in the snow.',
            'short-tours' => 'One to four day escapes from Ulaanbaatar — perfect between flights or train legs.',
        ];

        foreach ($data['categories'] as $i => $cat) {
            TourCategory::create([
                'name' => $cat['name'],
                'slug' => $cat['slug'],
                'icon' => $cat['icon'],
                'description' => $categoryDescriptions[$cat['slug']] ?? null,
                'sort_order' => $i,
            ]);
        }

        foreach ($data['destinations'] as $i => $dest) {
            Destination::create([
                'name' => $dest['name'],
                'slug' => $dest['slug'],
                'region' => $dest['region'],
                'description' => $dest['description'] ?: null,
                'image' => $dest['image'],
                'lat' => $dest['lat'] ?? null,
                'lng' => $dest['lng'] ?? null,
                'sort_order' => $i,
            ]);
        }

        $postCategories = [
            ['name' => 'Travel Tips', 'slug' => 'travel-tips', 'icon' => 'lightbulb'],
            ['name' => 'Places to Visit', 'slug' => 'places-to-visit', 'icon' => 'map-pin'],
            ['name' => 'Culture & History', 'slug' => 'culture-history', 'icon' => 'landmark'],
            ['name' => 'Things to Know', 'slug' => 'things-to-know', 'icon' => 'info'],
            ['name' => 'Festivals & Events', 'slug' => 'news-events', 'icon' => 'newspaper'],
        ];

        foreach ($postCategories as $i => $cat) {
            PostCategory::create($cat + ['sort_order' => $i]);
        }
    }
}
