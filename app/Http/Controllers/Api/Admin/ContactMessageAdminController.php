<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageAdminController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            ContactMessage::query()->latest()->paginate(20)->withQueryString()
        );
    }

    public function update(Request $request, ContactMessage $contactMessage): JsonResponse
    {
        $data = $request->validate(['is_read' => ['required', 'boolean']]);
        $contactMessage->update($data);

        return response()->json($contactMessage);
    }

    public function destroy(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->delete();

        return response()->json(['message' => 'Message deleted.']);
    }
}
