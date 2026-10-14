<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Tour;
use App\Models\TourCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TourController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Tour::query()
            ->where('is_published', true)
            ->with('categories:id,name,slug');

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        if ($category = $request->query('category')) {
            $query->whereHas('categories', fn ($q) => $q->where('slug', $category));
        }

        if ($destination = $request->query('destination')) {
            $query->whereHas('destinations', fn ($q) => $q->where('slug', $destination));
        }

        if ($duration = $request->query('duration')) {
            match ($duration) {
                '1' => $query->where('duration_days', 1),
                '2-3' => $query->whereBetween('duration_days', [2, 3]),
                '4-7' => $query->whereBetween('duration_days', [4, 7]),
                '8+' => $query->where('duration_days', '>=', 8),
                default => null,
            };
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        match ($request->query('sort')) {
            'price_asc' => $query->orderBy('price_from'),
            'price_desc' => $query->orderByDesc('price_from'),
            'duration' => $query->orderBy('duration_days'),
            'rating' => $query->orderByDesc('rating')->orderByDesc('reviews_count'),
            default => $query->orderByDesc('is_best_seller')->orderBy('sort_order'),
        };

        return response()->json($query->paginate(9)->withQueryString());
    }

    public function show(Tour $tour): JsonResponse
    {
        abort_unless($tour->is_published, 404);

        $tour->load([
            'categories:id,name,slug',
            'destinations:id,name,slug,region',
            'itineraryDays',
            'prices',
            'departures' => fn ($q) => $q->whereDate('start_date', '>=', now())->limit(10),
            'testimonials' => fn ($q) => $q->latest('travelled_at')->limit(6),
        ]);

        $related = Tour::where('is_published', true)
            ->where('id', '!=', $tour->id)
            ->whereHas('categories', fn ($q) => $q->whereIn(
                'tour_categories.id',
                $tour->categories->pluck('id')
            ))
            ->with('categories:id,name,slug')
            ->orderByDesc('is_best_seller')
            ->limit(3)
            ->get();

        return response()->json($tour->toArray() + ['related' => $related]);
    }

    public function filters(): JsonResponse
    {
        return response()->json([
            'categories' => TourCategory::withCount(['tours' => fn ($q) => $q->where('is_published', true)])
                ->orderBy('sort_order')->get(),
            'destinations' => Destination::withCount(['tours' => fn ($q) => $q->where('is_published', true)])
                ->orderBy('sort_order')->get(),
            'durations' => [
                ['value' => '1', 'label' => '1 day'],
                ['value' => '2-3', 'label' => '2–3 days'],
                ['value' => '4-7', 'label' => '4–7 days'],
                ['value' => '8+', 'label' => '8+ days'],
            ],
            'types' => [
                ['value' => 'join', 'label' => 'Join a group'],
                ['value' => 'private', 'label' => 'Private'],
            ],
        ]);
    }
}
