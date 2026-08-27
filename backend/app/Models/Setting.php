<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $guarded = [];

    /** Return all settings as key => value with JSON values decoded. */
    public static function asArray(): array
    {
        return static::query()->pluck('value', 'key')
            ->map(function ($value) {
                $decoded = json_decode($value, true);

                return json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
            })
            ->all();
    }
}
