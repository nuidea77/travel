<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Page;
use Illuminate\Http\Request;

class PageAdminController extends SimpleCrudController
{
    protected string $model = Page::class;

    protected function rules(Request $request, ?int $ignoreId = null): array
    {
        return [
            'title' => ['required', 'string', 'max:190'],
            'slug' => ['required', 'string', 'max:190', 'unique:pages,slug'.($ignoreId ? ",{$ignoreId}" : '')],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'image' => ['nullable', 'string', 'max:190'],
        ];
    }
}
