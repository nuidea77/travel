<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TourAdminController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Tour::query()->withCount('departures')->orderBy('sort_order');

        if ($search = $request->query('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        return response()->json($query->paginate(20)->withQueryString());
    }

    public function show(Tour $tour): JsonResponse
    {
        $tour->load(['categories:id', 'destinations:id', 'itineraryDays', 'prices', 'departures']);

        return response()->json($tour);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $tour = Tour::create($data['attributes']);
        $this->syncRelations($tour, $data);

        return response()->json($this->fresh($tour), 201);
    }

    public function update(Request $request, Tour $tour): JsonResponse
    {
        $data = $this->validated($request, $tour->id);
        $tour->update($data['attributes']);
        $this->syncRelations($tour, $data);

        return response()->json($this->fresh($tour));
    }

    public function destroy(Tour $tour): JsonResponse
    {
        $tour->delete();

        return response()->json(['message' => 'Tour deleted.']);
    }

    private function fresh(Tour $tour): Tour
    {
        return $tour->fresh(['categories:id', 'destinations:id', 'itineraryDays', 'prices', 'departures']);
    }

    /** @return array{attributes: array, categories: array, destinations: array, itinerary_days: array, prices: array, departures: array} */
    private function validated(Request $request, ?int $ignoreId = null): array
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:190'],
            'slug' => ['required', 'string', 'max:190', 'unique:tours,slug'.($ignoreId ? ",{$ignoreId}" : '')],
            'excerpt' => ['required', 'string'],
            'overview' => ['nullable', 'string'],
            'type' => ['required', 'in:join,private'],
            'duration_days' => ['required', 'integer', 'min:1'],
            'price_from' => ['required', 'numeric', 'min:0'],
            'rating' => ['required', 'numeric', 'min:0', 'max:5'],
            'reviews_count' => ['required', 'integer', 'min:0'],
            'image' => ['nullable', 'string', 'max:190'],
            'highlights' => ['nullable', 'array'],
            'highlights.*' => ['string'],
            'included' => ['nullable', 'array'],
            'included.*' => ['string'],
            'excluded' => ['nullable', 'array'],
            'excluded.*' => ['string'],
            'good_to_know' => ['nullable', 'array'],
            'good_to_know.*.title' => ['required', 'string'],
            'good_to_know.*.body' => ['required', 'string'],
            'is_featured' => ['boolean'],
            'is_best_seller' => ['boolean'],
            'is_published' => ['boolean'],
            'sort_order' => ['integer'],
            'categories' => ['array'],
            'categories.*' => ['integer', 'exists:tour_categories,id'],
            'destinations' => ['array'],
            'destinations.*' => ['integer', 'exists:destinations,id'],
            'itinerary_days' => ['array'],
            'itinerary_days.*.day_number' => ['required', 'integer', 'min:1'],
            'itinerary_days.*.title' => ['required', 'string'],
            'itinerary_days.*.description' => ['nullable', 'string'],
            'itinerary_days.*.meals' => ['nullable', 'string'],
            'itinerary_days.*.accommodation' => ['nullable', 'string'],
            'itinerary_days.*.distance' => ['nullable', 'string'],
            'itinerary_days.*.map_label' => ['nullable', 'string', 'max:120'],
            'itinerary_days.*.lat' => ['nullable', 'numeric', 'between:-90,90'],
            'itinerary_days.*.lng' => ['nullable', 'numeric', 'between:-180,180'],
            'prices' => ['array'],
            'prices.*.min_people' => ['required', 'integer', 'min:1'],
            'prices.*.max_people' => ['required', 'integer', 'min:1'],
            'prices.*.price' => ['required', 'numeric', 'min:0'],
            'departures' => ['array'],
            'departures.*.start_date' => ['required', 'date'],
            'departures.*.end_date' => ['required', 'date'],
            'departures.*.price' => ['nullable', 'numeric'],
            'departures.*.seats_total' => ['required', 'integer', 'min:1'],
            'departures.*.seats_left' => ['required', 'integer', 'min:0'],
            'departures.*.status' => ['required', 'in:open,guaranteed,full'],
        ]);

        return [
            'attributes' => collect($validated)->except([
                'categories', 'destinations', 'itinerary_days', 'prices', 'departures',
            ])->all(),
            'categories' => $validated['categories'] ?? null,
            'destinations' => $validated['destinations'] ?? null,
            'itinerary_days' => $validated['itinerary_days'] ?? null,
            'prices' => $validated['prices'] ?? null,
            'departures' => $validated['departures'] ?? null,
        ];
    }

    /** Replace nested collections wholesale when the payload carries them. */
    private function syncRelations(Tour $tour, array $data): void
    {
        if (is_array($data['categories'])) {
            $tour->categories()->sync($data['categories']);
        }
        if (is_array($data['destinations'])) {
            $tour->destinations()->sync($data['destinations']);
        }
        if (is_array($data['itinerary_days'])) {
            $tour->itineraryDays()->delete();
            $tour->itineraryDays()->createMany(array_map(function (array $day) {
                $day['description'] = $day['description'] ?? '';

                return $day;
            }, $data['itinerary_days']));
        }
        if (is_array($data['prices'])) {
            $tour->prices()->delete();
            $tour->prices()->createMany($data['prices']);
        }
        if (is_array($data['departures'])) {
            $tour->departures()->delete();
            $tour->departures()->createMany($data['departures']);
        }
    }
}
