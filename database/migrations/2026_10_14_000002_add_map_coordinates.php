<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            $table->decimal('lat', 9, 6)->nullable()->after('image');
            $table->decimal('lng', 9, 6)->nullable()->after('lat');
        });

        Schema::table('itinerary_days', function (Blueprint $table) {
            $table->string('map_label')->nullable()->after('distance');
            $table->decimal('lat', 9, 6)->nullable()->after('map_label');
            $table->decimal('lng', 9, 6)->nullable()->after('lat');
        });
    }

    public function down(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            $table->dropColumn(['lat', 'lng']);
        });

        Schema::table('itinerary_days', function (Blueprint $table) {
            $table->dropColumn(['map_label', 'lat', 'lng']);
        });
    }
};
