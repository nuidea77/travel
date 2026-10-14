<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'tour_id' => ['nullable', 'integer', 'exists:tours,id'],
            'departure_id' => ['nullable', 'integer', 'exists:departures,id'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:60'],
            'country' => ['nullable', 'string', 'max:90'],
            'travelers' => ['nullable', 'integer', 'min:1', 'max:99'],
            'preferred_date' => ['nullable', 'date'],
            'message' => ['nullable', 'string', 'max:3000'],
        ]);

        $booking = Booking::create($data + ['status' => 'new']);

        return response()->json([
            'message' => 'Thank you! Your request has been received — our travel specialists will reply within 24 hours.',
            'data' => ['id' => $booking->id],
        ], 201);
    }
}
