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
            ['name' => 'Sarah Mitchell', 'country' => 'United Kingdom', 'rating' => 5, 'travelled_at' => '2026-06-11', 'tour' => 'nomadic-adventure-tour', 'title' => 'Three weeks that rearranged my priorities', 'body' => 'Twenty-one days without a single dud. The Gobi was everything promised, but the two days with the Tsaatan reindeer herders were the most moving travel experience of my life. Flawlessly organized from the first email to the airport drop-off.'],
            ['name' => 'Marco & Elena Rossi', 'country' => 'Italy', 'rating' => 5, 'travelled_at' => '2026-07-16', 'tour' => 'mongol-discovery-tour', 'title' => 'Perfectly organized from start to finish', 'body' => 'Every detail handled, yet nothing felt scripted. Khuvsgul Lake after the Gobi crossing felt like arriving on another planet. Our guide read the group perfectly and the driver deserves a medal for the roads he made feel smooth.'],
            ['name' => 'Jennifer Park', 'country' => 'United States', 'rating' => 5, 'travelled_at' => '2026-07-12', 'tour' => 'grand-naadam-gobi-tour', 'title' => 'Naadam then the desert — unbeatable week', 'body' => 'The opening ceremony was overwhelming in the best way, and then the Gobi silence right after made it even better. Great seats, great gers, great cook. Book early — July fills fast and now I understand why.'],
            ['name' => 'Thomas Weber', 'country' => 'Germany', 'rating' => 5, 'travelled_at' => '2026-06-10', 'tour' => 'gobi-mirage-tour', 'title' => 'Ideal short introduction to the Gobi', 'body' => 'Six days, five icons, zero wasted time. The camel evening at Khongor and the sunset from the dune crest justified the whole trip by themselves. Superb value for a fully guided week.'],
            ['name' => 'Aiko Tanaka', 'country' => 'Japan', 'rating' => 5, 'travelled_at' => '2026-08-19', 'tour' => 'tsaatan-tour', 'title' => 'The reindeer camp was worth every mile', 'body' => 'Riding into the taiga to the Tsaatan family, then waking up surrounded by reindeer in the mist — unreal. The visit was handled respectfully, which mattered to me. Khuvsgul on the way back was the perfect decompression.'],
            ['name' => 'Liam O\'Connor', 'country' => 'Ireland', 'rating' => 5, 'travelled_at' => '2026-07-12', 'tour' => 'horseback-adventure-tour', 'title' => 'The Eight Lakes ride is world class', 'body' => 'Five days in the saddle through country you cannot reach any other way. Steady horses, patient wranglers, camps by the water every night. The Gobi warm-up week made it a complete trip rather than just a trek.'],
            ['name' => 'Claire Dubois', 'country' => 'France', 'rating' => 5, 'travelled_at' => '2026-08-15', 'tour' => 'magnificent-mongolia-tour', 'title' => 'Desert and heartland in perfect proportion', 'body' => 'The company\'s namesake tour and it shows. Gobi mornings, Orkhon riding days, hot springs under the stars at Tsenkher. Our host family in the valley treated us like relatives by day two.'],
            ['name' => 'David & Ruth Goldstein', 'country' => 'Australia', 'rating' => 5, 'travelled_at' => '2026-07-20', 'tour' => 'once-in-mongolia-tour', 'title' => 'Superb three days with our kids (8 and 11)', 'body' => 'Wild horses at dusk, a monastery morning and a night with a herding family — our children still talk about milking the goats. Gentle pacing, endless patience from the team. Unreservedly recommended for families.'],
            ['name' => 'Erik Lindqvist', 'country' => 'Sweden', 'rating' => 5, 'travelled_at' => '2026-03-05', 'tour' => 'ice-festival-tour', 'title' => 'Winter Mongolia is a secret worth keeping', 'body' => 'Minus twenty and I have never felt more alive. Sleigh races on a meter of blue ice, wrestling in fur, evenings by the stove. Superbly equipped — the sleeping bags meant I was never once cold at night.'],
        ];

        foreach ($testimonials as $t) {
            $tourSlug = $t['tour'];
            unset($t['tour']);
            Testimonial::create($t + ['tour_id' => $tours[$tourSlug] ?? null]);
        }
    }
}
