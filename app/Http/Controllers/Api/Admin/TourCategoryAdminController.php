<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\TourCategory;
use Illuminate\Http\Request;

class TourCategoryAdminController extends SimpleCrudController
{
    protected string $model = TourCategory::class;

    protected function rules(Request $request, ?int $ignoreId = null): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['required', 'string', 'max:120', 'unique:tour_categories,slug'.($ignoreId ? ",{$ignoreId}" : '')],
            'icon' => ['nullable', 'string', 'max:60'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['integer'],
        ];
    }
}
