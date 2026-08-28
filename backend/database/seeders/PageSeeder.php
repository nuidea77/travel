<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'title' => 'About Us',
                'slug' => 'about-us',
                'subtitle' => 'Authentic Mongolian tours, run by a local team in Ulaanbaatar',
                'image' => '/images/hero-steppe.svg',
                'body' => "<p>Magnificent Mongolia is a locally owned tour operator based in Ulaanbaatar, running authentic journeys across all five regions of the country — the Gobi in the south, the Khangai heartland, the great lakes and taiga of the north, the Kazakh west and the little-visited east of Chinggis Khan's homeland.</p><h2>How we work</h2><ul><li><strong>Every style of journey.</strong> Scheduled small-group departures at honest prices, and private tours built around your dates for one to sixteen travelers.</li><li><strong>Two comfort plans.</strong> A budget plan built on family ger stays, homestays and expedition tents, and a standard/luxury plan using the best tourist camps on each route — the same country either way.</li><li><strong>Real logistics.</strong> Sturdy 4WD vehicles, experienced drivers, licensed English-speaking guides, park permits handled, three meals a day and sleeping bags provided.</li><li><strong>Around-the-clock care.</strong> In season our team is reachable 24/7 — an award-winning habit we intend to keep.</li></ul><h2>What we believe</h2><p>The best of Mongolia happens at walking pace: tea in a family ger, a dune climbed for sunset, a festival where you are a guest rather than a spectator. We keep groups small, pay our herder partners fairly and directly, and design every route so the country can breathe through it.</p><h2>Recognition</h2><p>We are proud winners of a Travel &amp; Hospitality award, and prouder still of the reviews our travelers leave on TripAdvisor and Google — most of our bookings arrive by word of mouth.</p>",
            ],
            [
                'title' => 'About Mongolia',
                'slug' => 'about-mongolia',
                'subtitle' => 'The essential briefing on the land of the eternal blue sky',
                'image' => '/images/nomad-life.svg',
                'body' => "<p>Mongolia is the 18th largest country in the world and the least densely populated: 3.5 million people in a territory the size of Western Europe, nearly half of them in one city. What fills the rest is space — steppe, desert, mountain and taiga under a sky that earns its \"eternal blue\" name with more than 250 sunny days a year. The New York Times listed Mongolia among its 52 Places to Go in 2025, and the world is starting to notice.</p><h2>Fast facts</h2><ul><li><strong>Capital:</strong> Ulaanbaatar — the coldest capital city on earth</li><li><strong>Population:</strong> ~3.5 million; around 1.6 million in Ulaanbaatar</li><li><strong>Language:</strong> Mongolian (Kazakh in the far west); English is common in tourism</li><li><strong>Currency:</strong> Mongolian tugrik (MNT); cards work in the capital, cash rules the countryside</li><li><strong>Time zone:</strong> UTC+8 (Ulaanbaatar)</li><li><strong>Religion:</strong> Tibetan Buddhism alongside living shamanic tradition</li></ul><h2>A short history</h2><p>In 1206 Temujin united the steppe tribes and, as Chinggis Khan, launched the largest contiguous land empire in history. After centuries under Qing rule and a Soviet-aligned twentieth century, Mongolia became a vigorous multiparty democracy in 1990, balancing mining wealth, nomadic tradition and a young urban generation.</p><h2>The five regions we travel</h2><ul><li><strong>South:</strong> the Gobi — singing dunes, the Flaming Cliffs, ice gorges and camel country.</li><li><strong>Central:</strong> the Khangai heartland — Kharkhorin, the Orkhon valley, hot springs and volcanoes.</li><li><strong>North:</strong> Khuvsgul Lake, the Darkhad valley and the Tsaatan reindeer herders.</li><li><strong>West:</strong> the Altai — glaciers, the Great Lakes and Kazakh eagle hunters.</li><li><strong>East:</strong> the birthplace of Chinggis Khan, sacred volcanoes and the emptiest steppe of all.</li></ul><h2>Nomadic life today</h2><p>Roughly a quarter of Mongolians still herd livestock across the seasons, living in gers and moving camp with the grass. The \"five snouts\" — horses, cattle and yaks, sheep, goats and camels — remain the measure of wealth and the engine of hospitality. Guests are sacred here, and the open door of a ger is a three-thousand-year-old institution that is genuinely open to you.</p>",
            ],
            [
                'title' => 'Car Rental with Driver',
                'slug' => 'car-rental',
                'subtitle' => 'Land Cruisers, Russian vans and minibuses — always with a professional at the wheel',
                'image' => '/images/moto-adventure.svg',
                'body' => "<p>Mongolia has under 10,000 km of paved road and a million kilometres of track, river ford and open steppe. That is why we rent vehicles <strong>with professional drivers</strong> — people who navigate by mountain silhouette, fix what breaks, and know which river crossing moved since last summer.</p><h2>The fleet</h2><ul><li><strong>Toyota Land Cruiser</strong> — the countryside standard: 4 passengers, indestructible.</li><li><strong>Russian UAZ-452 \"Furgon\"</strong> — the beloved loaf-van: 6 passengers, goes absolutely anywhere.</li><li><strong>Modern minivans &amp; coaches</strong> — for city transfers and paved-route groups.</li></ul><h2>What's included</h2><p>Professional driver, fuel for the agreed route, vehicle insurance, and the driver's meals and lodging. Add an English-speaking guide, camping kit or cook as needed.</p><h2>How it works</h2><p>Tell us your route and dates through the contact form. We confirm availability within 24 hours with a fixed all-in quote — no fuel surcharges, no surprises.</p>",
            ],
        ];

        foreach ($pages as $page) {
            Page::updateOrCreate(['slug' => $page['slug']], $page);
        }
    }
}
