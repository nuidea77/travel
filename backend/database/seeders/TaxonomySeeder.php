<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\PostCategory;
use App\Models\TourCategory;
use Illuminate\Database\Seeder;

class TaxonomySeeder extends Seeder
{
    public function run(): void
    {
        $tourCategories = [
            ['name' => 'Best Seller', 'slug' => 'best-seller', 'icon' => 'award', 'description' => 'Our most loved journeys, refined over two decades of guiding.'],
            ['name' => 'Cultural & Nomadic', 'slug' => 'cultural-nomadic', 'icon' => 'tent', 'description' => 'Live alongside herder families and experience true nomadic life.'],
            ['name' => 'Horse & Camel Ride', 'slug' => 'horse-camel-ride', 'icon' => 'horse', 'description' => 'Travel the steppe the way Mongolians have for a thousand years.'],
            ['name' => 'Naadam & Events', 'slug' => 'naadam-events', 'icon' => 'flag', 'description' => 'Wrestling, archery and horse racing at Mongolia\'s greatest festival.'],
            ['name' => 'Nature & Exploring', 'slug' => 'nature-exploring', 'icon' => 'mountain', 'description' => 'National parks, dunes, lakes and volcanoes off the beaten path.'],
            ['name' => 'Trekking & Hiking', 'slug' => 'trekking-hiking', 'icon' => 'footprints', 'description' => 'Multi-day treks through Altai peaks and taiga forest.'],
            ['name' => 'Motorcycle & Bike', 'slug' => 'motorcycle-bike', 'icon' => 'bike', 'description' => 'Ride open horizons on two wheels with full support crew.'],
            ['name' => 'Fishing & Rafting', 'slug' => 'fishing-rafting', 'icon' => 'fish', 'description' => 'Cast for taimen and raft glacier-fed rivers.'],
            ['name' => 'Photo & Filming', 'slug' => 'photo-filming', 'icon' => 'camera', 'description' => 'Golden light, eagle hunters and epic landscapes for your lens.'],
            ['name' => 'Family Friendly', 'slug' => 'family-friendly', 'icon' => 'users', 'description' => 'Gentle pacing, comfortable camps and activities kids love.'],
            ['name' => 'Winter', 'slug' => 'winter', 'icon' => 'snowflake', 'description' => 'Ice festivals, eagle hunting and the quiet white steppe.'],
        ];

        foreach ($tourCategories as $i => $cat) {
            TourCategory::create($cat + ['sort_order' => $i]);
        }

        $destinations = [
            ['name' => 'Gobi Desert', 'slug' => 'gobi-desert', 'region' => 'South', 'image' => '/images/gobi-dunes.svg', 'description' => 'Singing dunes of Khongoryn Els, the Flaming Cliffs of Bayanzag and camel country.'],
            ['name' => 'Lake Khuvsgul', 'slug' => 'lake-khuvsgul', 'region' => 'North', 'image' => '/images/lake-khuvsgul.svg', 'description' => 'The "Blue Pearl" — a 136 km alpine lake holding 70% of Mongolia\'s fresh water.'],
            ['name' => 'Altai Tavan Bogd', 'slug' => 'altai-tavan-bogd', 'region' => 'West', 'image' => '/images/altai-peaks.svg', 'description' => 'Glaciated 4,000 m peaks, Kazakh eagle hunters and petroglyph valleys.'],
            ['name' => 'Kharkhorin & Erdene Zuu', 'slug' => 'kharkhorin-erdene-zuu', 'region' => 'Central', 'image' => '/images/kharkhorin.svg', 'description' => 'The 13th-century imperial capital and Mongolia\'s oldest monastery.'],
            ['name' => 'Gorkhi-Terelj National Park', 'slug' => 'gorkhi-terelj', 'region' => 'Central', 'image' => '/images/terelj-park.svg', 'description' => 'Granite valleys, Turtle Rock and ger camps an hour from the capital.'],
            ['name' => 'Khustai National Park', 'slug' => 'khustai', 'region' => 'Central', 'image' => '/images/khustai-horses.svg', 'description' => 'Home of the takhi — the world\'s last truly wild horse.'],
            ['name' => 'Khorgo & Terkhiin Tsagaan', 'slug' => 'khorgo-terkhiin-tsagaan', 'region' => 'Central', 'image' => '/images/volcano-terkh.svg', 'description' => 'An extinct volcano crater above the Great White Lake.'],
            ['name' => 'Khentii Mountains', 'slug' => 'khentii-mountains', 'region' => 'East', 'image' => '/images/hero-steppe.svg', 'description' => 'Birthplace of Chinggis Khaan, sacred peaks and larch forest.'],
            ['name' => 'Chinggis Khaan Statue', 'slug' => 'chinggis-khaan-statue', 'region' => 'Central', 'image' => '/images/trans-mongolian.svg', 'description' => 'The 40 m stainless-steel equestrian statue at Tsonjin Boldog.'],
            ['name' => 'Ulaanbaatar', 'slug' => 'ulaanbaatar', 'region' => 'Capital', 'image' => '/images/ulaanbaatar.svg', 'description' => 'Monasteries, museums and nightlife in the world\'s coldest capital.'],
        ];

        foreach ($destinations as $i => $dest) {
            Destination::create($dest + ['sort_order' => $i]);
        }

        $postCategories = [
            ['name' => 'Travel Tips', 'slug' => 'travel-tips', 'icon' => 'lightbulb'],
            ['name' => 'Places to Visit', 'slug' => 'places-to-visit', 'icon' => 'map-pin'],
            ['name' => 'Culture & History', 'slug' => 'culture-history', 'icon' => 'landmark'],
            ['name' => 'Things to Know', 'slug' => 'things-to-know', 'icon' => 'info'],
            ['name' => 'News & Events', 'slug' => 'news-events', 'icon' => 'newspaper'],
        ];

        foreach ($postCategories as $i => $cat) {
            PostCategory::create($cat + ['sort_order' => $i]);
        }
    }
}
