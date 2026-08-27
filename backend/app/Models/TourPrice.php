<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TourPrice extends Model
{
    protected $guarded = [];

    protected $casts = ['price' => 'float'];

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }
}
