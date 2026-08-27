<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt');
            $table->longText('overview')->nullable();
            $table->string('type')->default('join'); // join | private
            $table->unsignedInteger('duration_days');
            $table->decimal('price_from', 10, 2);
            $table->decimal('rating', 2, 1)->default(5.0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->string('image')->nullable();
            $table->json('highlights')->nullable();
            $table->json('included')->nullable();
            $table->json('excluded')->nullable();
            $table->json('good_to_know')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_best_seller')->default(false);
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('tour_tour_category', function (Blueprint $table) {
            $table->foreignId('tour_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tour_category_id')->constrained()->cascadeOnDelete();
            $table->primary(['tour_id', 'tour_category_id']);
        });

        Schema::create('destination_tour', function (Blueprint $table) {
            $table->foreignId('tour_id')->constrained()->cascadeOnDelete();
            $table->foreignId('destination_id')->constrained()->cascadeOnDelete();
            $table->primary(['tour_id', 'destination_id']);
        });

        Schema::create('itinerary_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('day_number');
            $table->string('title');
            $table->text('description');
            $table->string('meals')->nullable();        // e.g. B+L+D
            $table->string('accommodation')->nullable(); // e.g. Ger camp
            $table->string('distance')->nullable();      // e.g. 220km, 5-6h
            $table->timestamps();
        });

        Schema::create('tour_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('min_people');
            $table->unsignedInteger('max_people');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });

        Schema::create('departures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id')->constrained()->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('price', 10, 2)->nullable();
            $table->unsignedInteger('seats_total')->default(16);
            $table->unsignedInteger('seats_left')->default(16);
            $table->string('status')->default('open'); // open | guaranteed | full
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('departures');
        Schema::dropIfExists('tour_prices');
        Schema::dropIfExists('itinerary_days');
        Schema::dropIfExists('destination_tour');
        Schema::dropIfExists('tour_tour_category');
        Schema::dropIfExists('tours');
    }
};
