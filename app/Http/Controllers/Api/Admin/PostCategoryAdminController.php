<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\PostCategory;
use Illuminate\Http\Request;

class PostCategoryAdminController extends SimpleCrudController
{
    protected string $model = PostCategory::class;

    protected function rules(Request $request, ?int $ignoreId = null): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['required', 'string', 'max:120', 'unique:post_categories,slug'.($ignoreId ? ",{$ignoreId}" : '')],
            'icon' => ['nullable', 'string', 'max:60'],
            'sort_order' => ['integer'],
        ];
    }
}
