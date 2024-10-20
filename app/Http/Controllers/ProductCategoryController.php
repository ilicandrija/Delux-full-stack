<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use App\Http\Resources\ProductCategoryResource;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{
    public function index()
    {
        return ProductCategoryResource::collection(ProductCategory::all());
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

        $category = ProductCategory::create($request->all());

        return new ProductCategoryResource($category);
    }

    public function show($id)
    {
        $category = ProductCategory::findOrFail($id);
        return new ProductCategoryResource($category);
    }

    public function update(Request $request, $id)
    {
        $category = ProductCategory::findOrFail($id);

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

        return new ProductCategoryResource($category);
    }

    public function destroy($id)
    {
        ProductCategory::destroy($id);
        return response()->noContent();
    }
}
