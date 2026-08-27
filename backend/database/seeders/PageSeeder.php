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
                'subtitle' => 'A local team guiding travelers across Mongolia since 2004',
                'image' => '/images/hero-steppe.svg',
                'body' => "<p>Nomad Horizons was founded in Ulaanbaatar in 2004 by a small group of guides who believed Mongolia deserved better than drive-by tourism. Two decades and more than eighteen thousand travelers later, we are still fully locally owned, still small enough to know every driver, cook and camp owner by name — and still convinced that the best moments of any journey here happen at walking pace, over a bowl of tea.</p><h2>What we believe</h2><ul><li><strong>Local first.</strong> Our guides, drivers and office team are Mongolian; the families we visit are partners of many years, paid fairly and directly.</li><li><strong>Small groups.</strong> Join-in tours are capped at sixteen so a camp visit never becomes a crowd.</li><li><strong>Honest logistics.</strong> Distances here are real. We tell you exactly how long the drives are and make the vehicle time part of the pleasure — good music, good snacks, endless horizon.</li><li><strong>Leave it wilder.</strong> We carry out every scrap of waste, brief every group on ger etiquette, and contribute a share of each booking to takhi conservation at Khustai.</li></ul><h2>Our team</h2><p>Around thirty of us work year-round: trip designers in Ulaanbaatar, senior guides who have led over 200 departures each, master drivers who can fix anything with wire and patience, and cooks whose khorkhog has ended arguments. In summer the family grows to nearly a hundred.</p><h2>Recognition</h2><p>We are honored to hold a 2025 Travellers' Choice award and to have been recommended in major guidebooks — but the review we care most about is the one your herder host gives after you leave.</p>",
            ],
            [
                'title' => 'About Mongolia',
                'slug' => 'about-mongolia',
                'subtitle' => 'The essential briefing on the land of the eternal blue sky',
                'image' => '/images/nomad-life.svg',
                'body' => "<p>Mongolia is the least densely populated nation on earth: 3.5 million people in a country the size of Western Europe, nearly half of them in one city. What fills the rest is space — steppe, desert, mountain and taiga under a sky that earns its \"eternal blue\" name with over 250 sunny days a year.</p><h2>Fast facts</h2><ul><li><strong>Capital:</strong> Ulaanbaatar (the world's coldest capital city)</li><li><strong>Population:</strong> ~3.5 million; around 1.6 million in Ulaanbaatar</li><li><strong>Language:</strong> Mongolian (Kazakh in the far west); English is spoken in tourism</li><li><strong>Currency:</strong> Mongolian tugrik (MNT); cards work in the capital, cash rules the countryside</li><li><strong>Time zone:</strong> UTC+8 (Ulaanbaatar)</li><li><strong>Religion:</strong> Tibetan Buddhism, alongside deep shamanic traditions</li></ul><h2>A short history</h2><p>In 1206 Temujin united the warring tribes of the steppe and, as Chinggis Khaan, launched the largest contiguous land empire in history — at its height stretching from Korea to Hungary. The empire's postal relay, religious tolerance and trade networks reshaped Eurasia. After centuries under Qing rule and a Soviet-aligned twentieth century, Mongolia became a vigorous multiparty democracy in 1990, and today balances mining wealth, nomadic tradition and a young, urban, extremely online generation.</p><h2>Nomadic life today</h2><p>Roughly a quarter of Mongolians still herd livestock across the seasons, living in gers and moving camp two to four times a year. The \"five snouts\" — horses, cattle and yaks, sheep, goats and camels — remain the measure of wealth and the engine of hospitality. Guests are sacred here: the open door of a ger is a three-thousand-year-old institution, and it is genuinely open to you.</p><h2>Landscapes</h2><p>The Gobi's dunes and dinosaur cliffs in the south; the Khangai's rivers, volcanoes and hot springs in the center; Khuvsgul's alpine water in the north; and the glaciated Altai with its Kazakh eagle hunters in the west. Each is a separate trip's worth of world.</p>",
            ],
            [
                'title' => 'Car Rental with Driver',
                'slug' => 'car-rental',
                'subtitle' => 'Land Cruisers, vans and expedition trucks — always with a professional at the wheel',
                'image' => '/images/moto-adventure.svg',
                'body' => "<p>Mongolia has under 10,000 km of paved road and a million kilometres of track, river ford and open steppe. That is why we rent vehicles <strong>with professional drivers</strong> — men and women who navigate by mountain silhouette, fix what breaks, and know which river crossing moved since last summer.</p><h2>The fleet</h2><ul><li><strong>Toyota Land Cruiser 76/78</strong> — the countryside standard: 4 passengers, indestructible. From $140/day.</li><li><strong>Russian UAZ-452 \"Furgon\"</strong> — the beloved loaf-van: 6 passengers, goes absolutely anywhere, all character. From $110/day.</li><li><strong>Modern minivans & coaches</strong> — for city transfers and paved-route groups. From $90/day.</li></ul><h2>What's included</h2><p>Professional driver, fuel for the agreed route, vehicle insurance, and the driver's meals and lodging. Add an English-speaking guide, camping kit or cook as needed.</p><h2>How it works</h2><p>Tell us your route and dates through the contact form. We confirm availability within 24 hours with a fixed all-in quote — no fuel surcharges, no surprises.</p>",
            ],
        ];

        foreach ($pages as $page) {
            Page::updateOrCreate(['slug' => $page['slug']], $page);
        }
    }
}
