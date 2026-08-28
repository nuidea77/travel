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
            ['name' => 'Discovery Tours', 'slug' => 'discovery', 'icon' => 'compass', 'description' => 'Classic multi-region journeys linking the Gobi, the Khangai heartland and the northern lakes.'],
            ['name' => 'Adventure & Overland', 'slug' => 'adventure-overland', 'icon' => 'mountain', 'description' => 'Long expedition routes for travelers who want to cross the country the hard, glorious way.'],
            ['name' => 'Horse Riding', 'slug' => 'horse-riding', 'icon' => 'horse', 'description' => 'Multi-day rides with wranglers and pack support — the steppe as it is meant to be seen.'],
            ['name' => 'Hiking & Trekking', 'slug' => 'hiking-trekking', 'icon' => 'footprints', 'description' => 'Volcano rims, dune crests, gorge trails and the high Altai on foot.'],
            ['name' => 'Sightseeing & Cultural', 'slug' => 'sightseeing-cultural', 'icon' => 'landmark', 'description' => 'Monasteries, museums, nomad family visits and the living heritage of the empire.'],
            ['name' => 'Festival & Events', 'slug' => 'festival-events', 'icon' => 'flag', 'description' => 'Naadam, the Golden Eagle Festival, ice, camel and yak festivals — timed to the day.'],
            ['name' => 'Wildlife & Photography', 'slug' => 'wildlife-photography', 'icon' => 'camera', 'description' => 'Takhi horses, reindeer camps, eagle hunters and golden-hour landscapes for your lens.'],
            ['name' => 'Winter Tours', 'slug' => 'winter', 'icon' => 'snowflake', 'description' => 'The white season: ice festivals, frozen lakes and gers glowing warm in the snow.'],
            ['name' => 'Short Tours', 'slug' => 'short-tours', 'icon' => 'clock', 'description' => 'One to four day escapes from Ulaanbaatar — perfect between flights or train legs.'],
        ];

        foreach ($tourCategories as $i => $cat) {
            TourCategory::create($cat + ['sort_order' => $i]);
        }

        $destinations = [
            // South — the Gobi
            ['name' => 'Khongor Sand Dunes', 'slug' => 'khongor-sand-dunes', 'region' => 'South', 'image' => '/images/gobi-dunes.svg', 'description' => 'The "singing" dunes of the Gobi — up to 200 m tall and 180 km long, best climbed for sunset.'],
            ['name' => 'Bayanzag — Flaming Cliffs', 'slug' => 'bayanzag-flaming-cliffs', 'region' => 'South', 'image' => '/images/gobi-dunes.svg', 'description' => 'Red sandstone escarpments where the first dinosaur eggs were unearthed a century ago.'],
            ['name' => 'Yol Valley', 'slug' => 'yol-valley', 'region' => 'South', 'image' => '/images/altai-peaks.svg', 'description' => 'A shaded gorge in the Gurvan Saikhan mountains where ice lingers deep into summer.'],
            ['name' => 'Tsagaan Suvarga', 'slug' => 'tsagaan-suvarga', 'region' => 'South', 'image' => '/images/gobi-dunes.svg', 'description' => 'Eroded clay cliffs that glow white, pink and orange — the Gobi\'s painted wall.'],
            ['name' => 'Ongi Monastery', 'slug' => 'ongi-monastery', 'region' => 'South', 'image' => '/images/kharkhorin.svg', 'description' => 'Riverside ruins of one of Mongolia\'s largest monasteries, quietly being restored.'],
            ['name' => 'Baga Gazriin Chuluu', 'slug' => 'baga-gazriin-chuluu', 'region' => 'South', 'image' => '/images/terelj-park.svg', 'description' => 'A granite island in the middle Gobi steppe, full of hidden temples and ibex.'],

            // Central
            ['name' => 'Terelj National Park', 'slug' => 'terelj-national-park', 'region' => 'Central', 'image' => '/images/terelj-park.svg', 'description' => 'Granite valleys, Turtle Rock and the Aryapala meditation temple, an hour from the capital.'],
            ['name' => 'Chingis Khan Statue', 'slug' => 'chingis-khan-statue', 'region' => 'Central', 'image' => '/images/trans-mongolian.svg', 'description' => 'The 40 m stainless-steel equestrian statue at Tsonjin Boldog, east of Ulaanbaatar.'],
            ['name' => 'Khustai National Park', 'slug' => 'khustai-national-park', 'region' => 'Central', 'image' => '/images/khustai-horses.svg', 'description' => 'Home of the reintroduced takhi — Przewalski\'s horse — plus deer, boar and marmots.'],
            ['name' => 'Khugnu-Tarni National Park', 'slug' => 'khugnu-tarni', 'region' => 'Central', 'image' => '/images/hero-steppe.svg', 'description' => 'The "semi-Gobi": dunes, granite mountains and monasteries in one compact park.'],
            ['name' => 'Kharkhorin & Erdene Zuu', 'slug' => 'kharkhorin-erdene-zuu', 'region' => 'Central', 'image' => '/images/kharkhorin.svg', 'description' => 'The site of the imperial capital and Mongolia\'s oldest monastery, ringed by 108 stupas.'],
            ['name' => 'Orkhon Valley', 'slug' => 'orkhon-valley', 'region' => 'Central', 'image' => '/images/nomad-life.svg', 'description' => 'UNESCO-listed pastoral heartland — horse herds, lava fields and the Ulaantsutgalan waterfall.'],
            ['name' => 'Naiman Nuur — Eight Lakes', 'slug' => 'naiman-nuur', 'region' => 'Central', 'image' => '/images/lake-khuvsgul.svg', 'description' => 'Eight volcanic lakes high in the Khangai, reached only on foot or horseback.'],
            ['name' => 'Tsenkher Hot Springs', 'slug' => 'tsenkher-hot-springs', 'region' => 'Central', 'image' => '/images/volcano-terkh.svg', 'description' => 'Open-air thermal pools under larch forest — the classic rest day of the Khangai.'],
            ['name' => 'Khorgo-Terkh National Park', 'slug' => 'khorgo-terkh', 'region' => 'Central', 'image' => '/images/volcano-terkh.svg', 'description' => 'A climbable volcano crater above Terkhiin Tsagaan Nuur, the Great White Lake.'],
            ['name' => 'Tuvkhun Temple', 'slug' => 'tuvkhun-temple', 'region' => 'Central', 'image' => '/images/kharkhorin.svg', 'description' => 'Zanabazar\'s mountaintop hermitage at 2,600 m, hidden in old-growth forest.'],
            ['name' => 'Ugii Lake', 'slug' => 'ugii-lake', 'region' => 'Central', 'image' => '/images/fishing-rafting.svg', 'description' => 'A warm, bird-rich steppe lake famous for perch fishing and swimming summers.'],

            // North
            ['name' => 'Khuvsgul Lake', 'slug' => 'khuvsgul-lake', 'region' => 'North', 'image' => '/images/lake-khuvsgul.svg', 'description' => 'The "Blue Pearl" — an alpine lake holding most of Mongolia\'s fresh water.'],
            ['name' => 'Darkhad Valley & Tsaatan', 'slug' => 'darkhad-tsaatan', 'region' => 'North', 'image' => '/images/winter-tour.svg', 'description' => 'Taiga home of the Tsaatan reindeer herders, reached on horseback over the pass.'],
            ['name' => 'Amarbaysgalant Monastery', 'slug' => 'amarbaysgalant', 'region' => 'North', 'image' => '/images/kharkhorin.svg', 'description' => 'One of Mongolia\'s three great monastic centers, serene in the Iven valley.'],
            ['name' => 'Uran Togoo Volcano', 'slug' => 'uran-togoo', 'region' => 'North', 'image' => '/images/volcano-terkh.svg', 'description' => 'A perfectly round extinct crater you can walk into, cloaked in birch forest.'],

            // West
            ['name' => 'Altai Tavan Bogd', 'slug' => 'altai-tavan-bogd', 'region' => 'West', 'image' => '/images/altai-peaks.svg', 'description' => 'Glaciers, 4,374 m Khuiten Peak and petroglyph valleys on the far western border.'],
            ['name' => 'Ulgii & the Eagle Hunters', 'slug' => 'ulgii-eagle-hunters', 'region' => 'West', 'image' => '/images/eagle-hunter.svg', 'description' => 'Kazakh Mongolia: berkutchi families, embroidery and the Golden Eagle Festival.'],
            ['name' => 'Great Lakes of the West', 'slug' => 'great-lakes-west', 'region' => 'West', 'image' => '/images/fishing-rafting.svg', 'description' => 'Khyargas, Uvs, Achit and Telmen — a chain of vast, bird-thronged desert lakes.'],

            // East
            ['name' => 'Khentii — Chinggis Khan Country', 'slug' => 'khentii-chinggis', 'region' => 'East', 'image' => '/images/hero-steppe.svg', 'description' => 'Deluun Boldog, the Kherlen river and Baldan Bereeven monastery — the Khan\'s homeland.'],
            ['name' => 'Shiliin Bogd & Dariganga', 'slug' => 'shiliin-bogd', 'region' => 'East', 'image' => '/images/volcano-terkh.svg', 'description' => 'A sacred volcano, the Taliin Agui cave and Ganga Lake\'s autumn swan gatherings.'],

            // Capital
            ['name' => 'Ulaanbaatar', 'slug' => 'ulaanbaatar', 'region' => 'Capital', 'image' => '/images/ulaanbaatar.svg', 'description' => 'Monasteries, museums and cashmere in the world\'s coldest capital city.'],
        ];

        foreach ($destinations as $i => $dest) {
            // guard against any accidental bad image strings
            if (! str_starts_with((string) $dest['image'], '/images/') || str_contains((string) $dest['image'], ' ')) {
                $dest['image'] = '/images/hero-steppe.svg';
            }
            Destination::create($dest + ['sort_order' => $i]);
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
