<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Site Admin',
                'password' => bcrypt('password'),
            ]
        );

        $this->call([
            TaxonomySeeder::class,
            SettingSeeder::class,
            TourSeeder::class,
            PostSeeder::class,
            TestimonialSeeder::class,
            PageSeeder::class,
        ]);
    }
}
