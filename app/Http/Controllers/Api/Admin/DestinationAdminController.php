<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Destination;
use Illuminate\Http\Request;

class DestinationAdminController extends SimpleCrudController
{
    protected string $model = Destination::class;

    protected function rules(Request $request, ?int $ignoreId = null): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['required', 'string', 'max:120', 'unique:destinations,slug'.($ignoreId ? ",{$ignoreId}" : '')],
            'region' => ['nullable', 'string', 'max:60'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:190'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'sort_order' => ['integer'],
        ];
    }
}
