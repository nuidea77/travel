<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;

class TestimonialController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Testimonial::where('is_published', true)
                ->with('tour:id,title,slug')
                ->latest('travelled_at')
                ->limit(30)
                ->get()
        );
    }
}
