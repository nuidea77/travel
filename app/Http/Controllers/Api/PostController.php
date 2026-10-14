<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Post::query()
            ->where('is_published', true)
            ->with('category:id,name,slug')
            ->latest('published_at');

        if ($category = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(6)->withQueryString());
    }

    public function show(Post $post): JsonResponse
    {
        abort_unless($post->is_published, 404);

        $post->load('category:id,name,slug');

        $related = Post::where('is_published', true)
            ->where('id', '!=', $post->id)
            ->where('post_category_id', $post->post_category_id)
            ->with('category:id,name,slug')
            ->latest('published_at')
            ->limit(3)
            ->get();

        if ($related->count() < 3) {
            $related = $related->concat(
                Post::where('is_published', true)
                    ->where('id', '!=', $post->id)
                    ->whereNotIn('id', $related->pluck('id'))
                    ->with('category:id,name,slug')
                    ->latest('published_at')
                    ->limit(3 - $related->count())
                    ->get()
            );
        }

        return response()->json($post->toArray() + ['related' => $related->values()]);
    }

    public function categories(): JsonResponse
    {
        return response()->json(
            PostCategory::withCount(['posts' => fn ($q) => $q->where('is_published', true)])
                ->orderBy('sort_order')
                ->get()
        );
    }
}
