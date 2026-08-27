<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tour extends Model
{
    protected $guarded = [];

    protected $casts = [
        'highlights' => 'array',
        'included' => 'array',
        'excluded' => 'array',
        'good_to_know' => 'array',
        'is_featured' => 'boolean',
        'is_best_seller' => 'boolean',
        'is_published' => 'boolean',
        'price_from' => 'float',
        'rating' => 'float',
    ];

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(TourCategory::class);
    }

    public function destinations(): BelongsToMany
    {
        return $this->belongsToMany(Destination::class);
    }

    public function itineraryDays(): HasMany
    {
        return $this->hasMany(ItineraryDay::class)->orderBy('day_number');
    }

    public function prices(): HasMany
    {
        return $this->hasMany(TourPrice::class)->orderBy('min_people');
    }

    public function departures(): HasMany
    {
        return $this->hasMany(Departure::class)->orderBy('start_date');
    }

    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class)->where('is_published', true);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
