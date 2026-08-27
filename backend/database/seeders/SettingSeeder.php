<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'site_name' => 'Nomad Horizons',
            'legal_name' => 'Nomad Horizons Travel Co., Ltd',
            'tagline' => 'Private journeys & small group tours through Mongolia\'s nomadic heartland',
            'phone' => '+976 7011-1122',
            'whatsapp' => '+976 8811-2233',
            'email' => 'hello@nomadhorizons.mn',
            'address' => 'Suite 405, Peace Avenue 17, Sukhbaatar District, Ulaanbaatar 14210, Mongolia',
            'founded_year' => '2004',
            'socials' => json_encode([
                'facebook' => 'https://facebook.com/',
                'instagram' => 'https://instagram.com/',
                'youtube' => 'https://youtube.com/',
                'linkedin' => 'https://linkedin.com/',
                'x' => 'https://x.com/',
            ]),
            'stats' => json_encode([
                ['label' => 'Founded in Ulaanbaatar', 'value' => '2004'],
                ['label' => 'Happy travelers hosted', 'value' => '18K+'],
                ['label' => "Travellers' Choice award", 'value' => '2025'],
                ['label' => 'Years of experience', 'value' => '20+'],
                ['label' => 'Tailor-made & private tours', 'value' => '100%'],
            ]),
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
