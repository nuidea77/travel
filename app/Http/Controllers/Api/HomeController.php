<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Testimonial;
use App\Models\Tour;
use App\Models\TourCategory;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'featured_tours' => Tour::where('is_published', true)
                ->where('is_featured', true)
                ->with('categories:id,name,slug')
                ->orderBy('sort_order')
                ->limit(10)
                ->get(),
            'best_sellers' => Tour::where('is_published', true)
                ->where('is_best_seller', true)
                ->with('categories:id,name,slug')
                ->orderBy('sort_order')
                ->limit(6)
                ->get(),
            'categories' => TourCategory::withCount(['tours' => fn ($q) => $q->where('is_published', true)])
                ->orderBy('sort_order')
                ->get(),
            'destinations' => Destination::withCount(['tours' => fn ($q) => $q->where('is_published', true)])
                ->orderBy('sort_order')
                ->get(),
            'testimonials' => Testimonial::where('is_published', true)
                ->with('tour:id,title,slug')
                ->latest('travelled_at')
                ->limit(9)
                ->get(),
            'latest_posts' => Post::where('is_published', true)
                ->with('category:id,name,slug')
                ->latest('published_at')
                ->limit(5)
                ->get(),
            'post_categories' => PostCategory::withCount(['posts' => fn ($q) => $q->where('is_published', true)])
                ->orderBy('sort_order')
                ->get(),
        ]);
    }
}
