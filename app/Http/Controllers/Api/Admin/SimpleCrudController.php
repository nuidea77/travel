<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Shared CRUD for the small flat models (categories, destinations,
 * testimonials, pages). Subclasses define the model and its rules.
 */
abstract class SimpleCrudController extends Controller
{
    /** @var class-string<Model> */
    protected string $model;

    abstract protected function rules(Request $request, ?int $ignoreId = null): array;

    protected function query(Request $request)
    {
        return $this->model::query()->orderBy('id');
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->query($request)->get());
    }

    public function store(Request $request): JsonResponse
    {
        $row = $this->model::create($request->validate($this->rules($request)));

        return response()->json($row, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $row = $this->model::findOrFail($id);
        $row->update($request->validate($this->rules($request, $id)));

        return response()->json($row);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->model::findOrFail($id)->delete();

        return response()->json(['message' => 'Deleted.']);
    }
}
