<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Destination extends Model
{
    protected $guarded = [];

    public function tours(): BelongsToMany
    {
        return $this->belongsToMany(Tour::class);
    }
}
