<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\ContactMessage;
use App\Models\Destination;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Testimonial;
use App\Models\Tour;
use App\Models\TourCategory;
use App\Support\SiteImages;
use Illuminate\Http\JsonResponse;

class MetaAdminController extends Controller
{
    /** Dashboard stats and the option lists the admin forms need. */
    public function index(): JsonResponse
    {
        return response()->json([
            'counts' => [
                'tours' => Tour::count(),
                'posts' => Post::count(),
                'testimonials' => Testimonial::count(),
                'bookings_new' => Booking::where('status', 'new')->count(),
                'bookings_total' => Booking::count(),
                'messages_unread' => ContactMessage::where('is_read', false)->count(),
            ],
            'recent_bookings' => Booking::with('tour:id,title')->latest()->limit(6)->get(),
            'recent_messages' => ContactMessage::latest()->limit(6)->get(),
            'images' => SiteImages::options(),
            'tour_categories' => TourCategory::orderBy('sort_order')->get(['id', 'name']),
            'destinations' => Destination::orderBy('sort_order')->get(['id', 'name']),
            'post_categories' => PostCategory::orderBy('sort_order')->get(['id', 'name']),
            'tours' => Tour::orderBy('title')->get(['id', 'title']),
        ]);
    }
}
