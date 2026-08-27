<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $categories = PostCategory::pluck('id', 'slug');

        $posts = [
            [
                'category' => 'travel-tips',
                'title' => 'Best Time to Visit Mongolia: A Month-by-Month Guide',
                'slug' => 'best-time-to-visit-mongolia',
                'excerpt' => 'From Naadam in July to eagle festivals in October and the luminous silence of winter — when should you actually come?',
                'read_time' => 7,
                'published_at' => '2026-05-14 09:00:00',
                'body' => "<p>Ask ten guides when to visit Mongolia and you will get ten confident, different answers — because every season here has a personality of its own.</p><h2>June to August: the classic season</h2><p>Summer is green, warm (20–28°C) and busy. Rivers run full, dairy is at its richest, and the Naadam festival lands in mid-July. Book camps and internal flights months ahead for this window.</p><h2>September: the connoisseur's month</h2><p>Crowds thin, larch forests turn gold, and the light gets long and photogenic. Nights are cold in a pleasant, stove-lit way. If you can travel in September, do.</p><h2>October to November: eagle season</h2><p>The Kazakh eagle festivals in the far west happen in early October. Days are crisp and blue; pack proper layers.</p><h2>December to February: the white season</h2><p>Yes, it is cold — often -25°C — but winter Mongolia is heartbreakingly beautiful and utterly empty of tourists. Ice festivals, camel festivals and the warmest hospitality of the year.</p><h2>March to May: shoulder and sandstorms</h2><p>Spring is dramatic and unpredictable: baby animals everywhere, occasional dust storms, low prices. For flexible travelers only.</p>",
            ],
            [
                'category' => 'travel-tips',
                'title' => 'What to Pack for the Gobi (and What to Leave Behind)',
                'slug' => 'what-to-pack-for-the-gobi',
                'excerpt' => 'Layers beat bulk, sandals beat boots at camp, and the one item nobody thinks to bring: a headlamp with a red-light mode.',
                'read_time' => 5,
                'published_at' => '2026-04-22 09:00:00',
                'body' => "<p>Packing for the Gobi is an exercise in respecting temperature swings: a 35°C afternoon can hand off to a 8°C night with total indifference to your suitcase.</p><h2>The essentials</h2><ul><li><strong>Layers:</strong> t-shirts, a fleece, a windproof shell. Cotton hoodies are heavy and slow to dry — skip them.</li><li><strong>Sun kit:</strong> high-SPF cream, lip balm, sunglasses, and a brimmed hat that survives wind.</li><li><strong>Footwear:</strong> broken-in walking shoes plus sandals for camp and dune climbing (barefoot on the dunes is even better).</li><li><strong>Headlamp:</strong> ger camps switch generators off around 23:00. Red-light mode keeps the stars intact.</li><li><strong>Wet wipes & hand sanitiser:</strong> showers exist, but not every night.</li></ul><h2>Leave behind</h2><p>Hairdryers (no sockets in most gers), drones without permits, and any schedule too rigid to survive a flat tire — that last one is a mindset more than an item.</p>",
            ],
            [
                'category' => 'news-events',
                'title' => 'Naadam Festival 2027: Dates, Tickets and How to See It Properly',
                'slug' => 'naadam-festival-2027-guide',
                'excerpt' => 'The Three Manly Games return on July 11–13. Here is how the ceremony, wrestling and racing actually work — and where you should be standing.',
                'read_time' => 8,
                'published_at' => '2026-08-01 09:00:00',
                'body' => "<p>Naadam — officially \"Eriin Gurvan Naadam\", the three games of men — is Mongolia's Olympics, national day and family reunion rolled into one. The 2027 national festival runs <strong>July 11–13 in Ulaanbaatar</strong>, with local naadams in the countryside through mid-July.</p><h2>The opening ceremony</h2><p>Held in the National Sports Stadium on the morning of July 11: mounted honor guards carrying the nine white banners, a cast of hundreds in period armor, and an hour of choreography that manages to be both solemn and joyful. Tickets are controlled — this is where a tour operator earns their keep.</p><h2>Wrestling</h2><p>512 wrestlers, no weight classes, no time limits. Watch for the eagle dance each wrestler performs before and after his bout. Finals happen on day two, by which point the stadium is pure electricity.</p><h2>Horse racing</h2><p>The races happen 40 km outside the city at Khui Doloon Khudag, over distances up to 26 km, ridden by children as young as seven. Standing at the finish as the leaders emerge from the heat shimmer is the most moving thing many travelers see in Mongolia.</p><h2>Archery and ankle-bone shooting</h2><p>Quieter, closer, and easier to photograph — both happen beside the main stadium and welcome wandering spectators.</p>",
            ],
            [
                'category' => 'culture-history',
                'title' => 'Twelve Mongolian Dishes to Try (and How to Eat Them Politely)',
                'slug' => 'mongolian-food-guide',
                'excerpt' => 'Buuz, khorkhog, airag and the correct way to accept anything offered in a ger — with your right hand, always.',
                'read_time' => 6,
                'published_at' => '2026-03-18 09:00:00',
                'body' => "<p>Mongolian cuisine is the food of people who move: meat, dairy and flour, engineered for cold and distance. Approach it on its own terms and it is deeply satisfying.</p><h2>The essentials</h2><ul><li><strong>Buuz</strong> — steamed mutton dumplings, the national dish. Bite a corner first to release the steam.</li><li><strong>Khuushuur</strong> — the fried cousin, best eaten scalding at a Naadam.</li><li><strong>Khorkhog</strong> — mutton barbecued in a churn with hot river stones. You'll be handed a stone to toss between your palms for good health.</li><li><strong>Tsuivan</strong> — hand-cut noodles fried with meat and the few vegetables that grow at this latitude.</li><li><strong>Airag</strong> — fermented mare's milk, ~2.5% alcohol, tangy and effervescent. Accept the bowl with your right hand, sip, and pass it back; nobody minds if you don't finish.</li><li><strong>Aaruul</strong> — rock-hard dried curd, the eternal car snack.</li><li><strong>Suutei tsai</strong> — salted milk tea, the metronome of ger life.</li></ul><h2>Ger etiquette in one paragraph</h2><p>Receive everything with your right hand or both hands. Don't step on the threshold. Sleeves down when offered snuff. And know that refusing food outright is harder work than tasting it — a symbolic nibble honors the household.</p>",
            ],
            [
                'category' => 'things-to-know',
                'title' => 'Do You Need a Visa for Mongolia? The 2026 Rules',
                'slug' => 'mongolia-visa-rules-2026',
                'excerpt' => 'Citizens of 60+ countries currently enter visa-free for 30 days — check the list, the e-visa portal, and the one form everyone forgets.',
                'read_time' => 4,
                'published_at' => '2026-02-10 09:00:00',
                'body' => "<p>Mongolia has quietly become one of Asia's easiest countries to enter.</p><h2>Visa-free entry</h2><p>Travelers from most of Europe, the US, Canada, Australia, Japan, Korea and many other countries can stay <strong>visa-free for 30 days</strong> (some nationalities 90). The visa-free program for many countries has been extended through the end of 2028.</p><h2>E-visa</h2><p>If your nationality is not on the visa-free list, the <strong>e-visa portal</strong> issues tourist visas online in about 72 hours — no embassy visit needed for most applicants.</p><h2>The details people miss</h2><ul><li>Your passport needs <strong>six months' validity</strong> beyond entry.</li><li>Stays over 30 days require registration with immigration within 7 days of arrival — your operator handles this on organized tours.</li><li>Always re-check rules for your specific nationality before booking; policies are updated annually.</li></ul>",
            ],
            [
                'category' => 'places-to-visit',
                'title' => 'Top 10 Places to Visit in Mongolia',
                'slug' => 'top-10-places-mongolia',
                'excerpt' => 'From the singing dunes of Khongoryn Els to the blue immensity of Khuvsgul — the ten landscapes that define the country.',
                'read_time' => 9,
                'published_at' => '2026-01-20 09:00:00',
                'body' => "<p>Choosing ten places in a country the size of Western Europe is an act of violence against the other hundred. But if you are planning a first or second trip, start here.</p><h2>1. Khongoryn Els</h2><p>The 100 km \"singing\" dunes of the South Gobi, up to 300 m tall. Climb at sunset; the hum under your feet is real.</p><h2>2. Bayanzag — the Flaming Cliffs</h2><p>Where dinosaur eggs were first discovered. The red escarpment ignites at golden hour.</p><h2>3. Lake Khuvsgul</h2><p>An alpine inland sea holding most of the nation's fresh water, ringed by larch and reindeer country.</p><h2>4. Kharkhorin & Erdene Zuu</h2><p>The ghost of the imperial capital and the monastery built from its stones, ringed by 108 stupas.</p><h2>5. Altai Tavan Bogd</h2><p>Glaciers, 4,374 m Khuiten Peak, and ten thousand petroglyphs in the far Kazakh west.</p><h2>6. Gorkhi-Terelj</h2><p>Granite valleys an hour from the capital — Mongolia's most accessible beauty.</p><h2>7. Khustai National Park</h2><p>The takhi wild horse, back from extinction and thriving.</p><h2>8. Orkhon Valley</h2><p>UNESCO-listed pastoral heartland: waterfalls, horse herds, and airag by the ladle.</p><h2>9. Khorgo & Terkhiin Tsagaan</h2><p>A climbable volcano above a lava-dammed white lake.</p><h2>10. Ulaanbaatar</h2><p>Chaotic, cold, alive — give the museums and monasteries a real day, not a layover.</p>",
            ],
            [
                'category' => 'culture-history',
                'title' => 'Staying in a Ger: What First-Timers Should Know',
                'slug' => 'staying-in-a-ger-guide',
                'excerpt' => 'The door faces south, the stove is sacred, and the felt walls have kept nomads warm for three thousand years.',
                'read_time' => 5,
                'published_at' => '2025-12-05 09:00:00',
                'body' => "<p>The ger — never call it a yurt around proud Mongolians, though they'll forgive you — is the most successful mobile home ever designed: up in an hour, warm at -30°C, and infinitely repairable.</p><h2>The layout means something</h2><p>The door always faces south. The north side (khoimor) is the place of honor where guests are seated; the west side is traditionally for men and saddles, the east for women and the kitchen. The two central posts hold up the toono crown — don't pass between them if you can avoid it.</p><h2>Tourist camps vs. family gers</h2><p>Tourist ger camps offer real beds, linens, a stove lit for you at dawn, and separate bathroom blocks with hot showers. Family stays are rawer and richer: expect to share space, wake with the animals and be fed relentlessly.</p><h2>Small courtesies</h2><ul><li>Enter without knocking (knocking implies suspicion) — a called-out \"Nokhoi khor!\" (\"hold the dog!\") is the traditional doorbell.</li><li>Accept tea with your right hand.</li><li>Never throw anything toward the stove — fire is sacred in Mongolian tradition.</li></ul>",
            ],
            [
                'category' => 'travel-tips',
                'title' => 'The Trans-Mongolian Railway: A Practical Guide',
                'slug' => 'trans-mongolian-railway-guide',
                'excerpt' => 'Beijing to Moscow through the Gobi and the steppe — classes, border crossings, and why the dining car is the best seat in Asia.',
                'read_time' => 7,
                'published_at' => '2025-11-12 09:00:00',
                'body' => "<p>The Trans-Mongolian branch of the great Siberian railway network runs from Beijing through Ulaanbaatar to Ulan-Ude, and it remains one of the world's definitive train journeys.</p><h2>Choosing a class</h2><p>Second class (kupe, four berths) is the sweet spot of comfort and company. First class buys privacy; platskart open bunks buy stories.</p><h2>The Mongolian dining car</h2><p>Attached at the border, wood-panelled and serving fried noodles and milk tea while the Gobi slides past — arrive early, linger long.</p><h2>Border reality</h2><p>The bogie change at the Chinese border takes several noisy hours overnight; keep snacks, patience and your passport handy.</p><h2>Break the journey</h2><p>Almost everyone who rides straight through wishes they had stopped in Mongolia. Even three days — Terelj, Khustai, a night in a ger — transforms the trip from transit into travel. Our rail-stopover packages exist for exactly this.</p>",
            ],
        ];

        foreach ($posts as $post) {
            $category = $post['category'];
            unset($post['category']);
            Post::create($post + [
                'post_category_id' => $categories[$category],
                'image' => $this->imageFor($post['slug']),
                'author' => 'Editorial Team',
            ]);
        }
    }

    private function imageFor(string $slug): string
    {
        return match ($slug) {
            'best-time-to-visit-mongolia' => '/images/hero-steppe.svg',
            'what-to-pack-for-the-gobi' => '/images/gobi-dunes.svg',
            'naadam-festival-2027-guide' => '/images/naadam-festival.svg',
            'mongolian-food-guide' => '/images/nomad-life.svg',
            'mongolia-visa-rules-2026' => '/images/ulaanbaatar.svg',
            'top-10-places-mongolia' => '/images/lake-khuvsgul.svg',
            'staying-in-a-ger-guide' => '/images/terelj-park.svg',
            'trans-mongolian-railway-guide' => '/images/trans-mongolian.svg',
            default => '/images/hero-steppe.svg',
        };
    }
}
