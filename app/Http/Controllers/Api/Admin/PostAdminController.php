<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostAdminController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Post::query()->with('category:id,name')->latest('published_at');

        if ($search = $request->query('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        return response()->json($query->paginate(20)->withQueryString());
    }

    public function show(Post $post): JsonResponse
    {
        return response()->json($post->load('category:id,name'));
    }

    public function store(Request $request): JsonResponse
    {
        $post = Post::create($this->validated($request));

        return response()->json($post, 201);
    }

    public function update(Request $request, Post $post): JsonResponse
    {
        $post->update($this->validated($request, $post->id));

        return response()->json($post->fresh('category:id,name'));
    }

    public function destroy(Post $post): JsonResponse
    {
        $post->delete();

        return response()->json(['message' => 'Post deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'post_category_id' => ['required', 'integer', 'exists:post_categories,id'],
            'title' => ['required', 'string', 'max:190'],
            'slug' => ['required', 'string', 'max:190', 'unique:posts,slug'.($ignoreId ? ",{$ignoreId}" : '')],
            'excerpt' => ['required', 'string'],
            'body' => ['required', 'string'],
            'image' => ['nullable', 'string', 'max:190'],
            'author' => ['required', 'string', 'max:120'],
            'read_time' => ['required', 'integer', 'min:1'],
            'published_at' => ['nullable', 'date'],
            'is_published' => ['boolean'],
        ]);
    }
}
