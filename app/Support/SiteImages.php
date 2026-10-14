<?php

namespace App\Support;

class SiteImages
{
    /**
     * Illustration set shipped with the Nuxt frontend (nuxt/public/images).
     * Stored as absolute web paths so the frontend can render them directly.
     */
    public static function options(): array
    {
        $files = [
            'hero-steppe', 'gobi-dunes', 'lake-khuvsgul', 'altai-peaks',
            'naadam-festival', 'horse-trek', 'terelj-park', 'kharkhorin',
            'eagle-hunter', 'moto-adventure', 'nomad-life', 'winter-tour',
            'khustai-horses', 'ulaanbaatar', 'volcano-terkh', 'trans-mongolian',
            'fishing-rafting',
        ];

        return array_map(fn (string $name) => "/images/{$name}.svg", $files);
    }
}
