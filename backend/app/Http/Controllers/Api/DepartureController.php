<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartureController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Departure::query()
            ->with('tour:id,title,slug,image,duration_days,price_from,type')
            ->whereHas('tour', fn ($q) => $q->where('is_published', true))
            ->whereDate('start_date', '>=', now())
            ->orderBy('start_date');

        if ($year = $request->integer('year')) {
            $query->whereYear('start_date', $year);
        }

        return response()->json($query->limit(100)->get());
    }
}
