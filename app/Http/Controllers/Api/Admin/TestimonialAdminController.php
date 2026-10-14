<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialAdminController extends SimpleCrudController
{
    protected string $model = Testimonial::class;

    protected function query(Request $request)
    {
        return Testimonial::query()->with('tour:id,title')->latest('travelled_at');
    }

    protected function rules(Request $request, ?int $ignoreId = null): array
    {
        return [
            'tour_id' => ['nullable', 'integer', 'exists:tours,id'],
            'name' => ['required', 'string', 'max:120'],
            'country' => ['required', 'string', 'max:90'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'title' => ['required', 'string', 'max:190'],
            'body' => ['required', 'string'],
            'travelled_at' => ['nullable', 'date'],
            'is_published' => ['boolean'],
        ];
    }
}
