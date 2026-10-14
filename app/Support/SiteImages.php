<?php

namespace App\Support;

class SiteImages
{
    /**
     * Images shipped with the Nuxt frontend (nuxt/public/images), as
     * absolute web paths the frontend can render directly. Scans the
     * directory so imported tour/destination photos show up in the
     * admin image pickers automatically.
     */
    public static function options(): array
    {
        $root = base_path('nuxt/public/images');
        if (! is_dir($root)) {
            return [];
        }

        $paths = [];
        foreach (['', 'tours/', 'destinations/'] as $dir) {
            foreach (glob($root.'/'.$dir.'*.{svg,jpg,jpeg,png,webp}', GLOB_BRACE) ?: [] as $file) {
                $paths[] = '/images/'.$dir.basename($file);
            }
        }

        return $paths;
    }
}
