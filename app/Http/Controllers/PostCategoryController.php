<?php

namespace App\Http\Controllers;

use App\Models\PostCategory;
use App\Http\Resources\PostCategoryResource;
use Illuminate\Http\Request;

class PostCategoryController extends Controller
{
    public function index()
    {
        return PostCategoryResource::collection(PostCategory::all());
    }

    public function store(Request $request)
    {
        // Validation rules
        $request->validate([
            'url' => 'required|url',
            'title' => 'required|string|max:255',
            'intro' => 'nullable|string',
            'body' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'keywords' => 'nullable|string',
            'schema_markup' => 'nullable|string',
        ]);

        $category = PostCategory::create($request->all());

        return new PostCategoryResource($category);
    }

    public function show($id)
    {
        $category = PostCategory::findOrFail($id);
        return new PostCategoryResource($category);
    }

    public function update(Request $request, $id)
    {
        $category = PostCategory::findOrFail($id);

        // Validation rules for update
        $request->validate([
            'url' => 'required|url',
            'title' => 'required|string|max:255',
            'intro' => 'nullable|string',
            'body' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'keywords' => 'nullable|string',
            'schema_markup' => 'nullable|string',
        ]);

        $category->update($request->all());

        return new PostCategoryResource($category);
    }

    public function destroy($id)
    {
        PostCategory::destroy($id);
        return response()->noContent();
    }
}
