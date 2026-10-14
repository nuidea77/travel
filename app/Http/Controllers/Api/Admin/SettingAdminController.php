<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingAdminController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Setting::orderBy('key')->get(['key', 'value']));
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*.key' => ['required', 'string', 'max:120'],
            'settings.*.value' => ['nullable', 'string'],
        ]);

        foreach ($data['settings'] as $row) {
            Setting::updateOrCreate(['key' => $row['key']], ['value' => $row['value'] ?? '']);
        }

        return response()->json(['message' => 'Settings saved.']);
    }
}
