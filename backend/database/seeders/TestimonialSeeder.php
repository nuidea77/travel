<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use App\Models\Tour;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $tours = Tour::pluck('id', 'slug');

        $testimonials = [
            ['name' => 'Sarah Mitchell', 'country' => 'United Kingdom', 'rating' => 5, 'travelled_at' => '2026-07-18', 'tour' => 'grand-mongolia-tour', 'title' => 'The trip of a lifetime — genuinely', 'body' => 'I use that phrase carefully and this earned it. Fourteen days without a single dud. Our guide Anuka read the group perfectly, the camps were far better than expected, and the night with the herder family was the most moving travel experience I have ever had.'],
            ['name' => 'Marco & Elena Rossi', 'country' => 'Italy', 'rating' => 5, 'travelled_at' => '2026-06-30', 'tour' => 'beauty-of-mongolia-tour', 'title' => 'Perfectly organized from airport to airport', 'body' => 'Every detail handled, yet nothing felt scripted. The hot springs evening under the stars and the horse ride at the White Lake were highlights. The driver deserves a medal for the roads he made feel smooth.'],
            ['name' => 'Jennifer Park', 'country' => 'United States', 'rating' => 5, 'travelled_at' => '2026-07-12', 'tour' => 'naadam-festival-gobi-tour', 'title' => 'Naadam was overwhelming in the best way', 'body' => 'Our seats for the opening ceremony were superb, and standing at the horse race finish line surrounded by cheering families is something I will never forget. Then the Gobi on top of it all. Book this one early — it is worth it.'],
            ['name' => 'Thomas Weber', 'country' => 'Germany', 'rating' => 5, 'travelled_at' => '2026-08-02', 'tour' => 'taste-of-mongolia-tour', 'title' => 'Ideal one-week introduction', 'body' => 'I only had eight days and this squeezed the essence of Mongolia into them without ever feeling rushed. The internal flight was a smart move. Already planning to come back for the west.'],
            ['name' => 'Aiko Tanaka', 'country' => 'Japan', 'rating' => 5, 'travelled_at' => '2026-06-21', 'tour' => 'lake-khuvsgul-tour', 'title' => 'The lake is even bluer than the photos', 'body' => 'Kayaking on water that clear felt unreal. Meeting the reindeer family was handled respectfully, which mattered to me. Wonderful food at the camp — the fresh fish dinner was the best meal of my whole trip.'],
            ['name' => 'Liam O\'Connor', 'country' => 'Ireland', 'rating' => 5, 'travelled_at' => '2026-07-25', 'tour' => 'motorcycle-adventure-tour', 'title' => 'Best riding of my life, full stop', 'body' => 'Twenty years of bikes on four continents and nothing compares to an open Mongolian valley at full throttle. Bikes were properly prepped, the mechanic was a wizard, and the cook somehow produced three hot meals a day in the middle of nowhere.'],
            ['name' => 'Claire Dubois', 'country' => 'France', 'rating' => 5, 'travelled_at' => '2026-08-09', 'tour' => 'experiencing-nomadic-life-tour', 'title' => 'Not a tour — a welcome into a family', 'body' => 'By day three I was milking yaks at dawn and by day five I did not want to leave. This trip asks a little more of you than sightseeing does, and gives back tenfold. The khorkhog feast with the neighbors was pure joy.'],
            ['name' => 'David & Ruth Goldstein', 'country' => 'Australia', 'rating' => 5, 'travelled_at' => '2026-09-02', 'tour' => 'central-mongolia-highlights-tour', 'title' => 'Superb with our two kids (8 and 11)', 'body' => 'The team adjusted everything to the children — shorter walks, camel rides, endless patience. Our kids still talk about the wild horses at dusk. Ger camps were comfortable and spotless. Unreservedly recommended for families.'],
            ['name' => 'Erik Lindqvist', 'country' => 'Sweden', 'rating' => 5, 'travelled_at' => '2026-02-14', 'tour' => 'eagle-hunters-winter-tour', 'title' => 'Winter Mongolia is a secret worth keeping', 'body' => 'Minus twenty and I have never felt more alive. Riding out with the eagle hunters through fresh snow, then thawing by the stove with the family — photographs cannot hold how beautiful and quiet it is. Superbly equipped and organized.'],
        ];

        foreach ($testimonials as $t) {
            $tourSlug = $t['tour'];
            unset($t['tour']);
            Testimonial::create($t + ['tour_id' => $tours[$tourSlug] ?? null]);
        }
    }
}
