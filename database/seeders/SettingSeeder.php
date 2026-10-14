<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'site_name' => 'Magnificent Mongolia',
            'legal_name' => 'Magnificent Mongolia Tour LLC',
            'tagline' => 'Authentic Mongolian tours across all five regions of the country',
            'logo_tagline' => 'Authentic Mongolian Tours',
            'phone' => '+976 9991-9363',
            'phone2' => '+976 8961-9363',
            'whatsapp' => '+976 9991-9363',
            'email' => 'info@mmongolia.com',
            'address' => 'Apt 48A-22, Tokyo Street, 3rd khoroo, Bayanzurkh District, Ulaanbaatar, Mongolia',
            'founded_year' => '2017',
            'socials' => json_encode([
                'facebook' => 'https://www.facebook.com/nomadictrips/',
                'instagram' => 'https://www.instagram.com/mmongoliatour/',
                'youtube' => 'https://youtube.com/',
                'x' => 'https://x.com/',
            ]),
            'stats' => json_encode([
                ['label' => 'Guiding travelers since', 'value' => '2017'],
                ['label' => 'Regions of Mongolia covered', 'value' => '5'],
                ['label' => 'Tours & festival packages', 'value' => '30+'],
                ['label' => 'Customer care, in season', 'value' => '24/7'],
                ['label' => 'Travel & Hospitality award', 'value' => 'Winner'],
            ]),
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
