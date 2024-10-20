<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Resources\ProductResource; // Assuming you created a ProductResource
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        $products = Product::all();
        return ProductResource::collection($products);
    }

    // Show the form for creating a new resource
    public function create()
    {
        // Return a view for creating a product if needed
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $validated = $request->validate([
            'url' => 'required|unique:products',
            'title' => 'required',
            'intro' => 'nullable',
            'body' => 'required',
            'featured_image' => 'nullable',
            'gallery' => 'nullable',
            'meta_title' => 'nullable',
            'meta_description' => 'nullable',
            'keywords' => 'nullable',
            'schema_markup' => 'nullable',
            'categories' => 'nullable|array', // Ensure this is an array
            'categories.*' => 'exists:product_categories,id', // Validate each category ID
            'regular_price' => 'required|numeric',
            'sale_price' => 'nullable|numeric',
            'sku' => 'nullable',
            'stock_status' => 'required',
            'status' => 'required',
            'images' => 'nullable|array', // Ensure this is an array
            'images.*' => 'exists:images,id', // Validate each image ID
        ]);

        // Create the product
        $product = Product::create($validated);

        // Sync the categories
        if ($request->has('categories')) {
            $product->categories()->attach($request->input('categories'));
        }

        return new ProductResource($product);
    }

    // Display the specified resource
    public function show(Product $product)
    {
        return new ProductResource($product);
    }

    // Show the form for editing the specified resource
    public function edit(Product $product)
    {
        // Return a view for editing the product if needed
    }

    // Update the specified resource in storage
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'url' => 'required|unique:products,url,' . $product->id,
            'title' => 'required',
            'intro' => 'nullable',
            'body' => 'required',
            'featured_image' => 'nullable',
            'gallery' => 'nullable',
            'meta_title' => 'nullable',
            'meta_description' => 'nullable',
            'keywords' => 'nullable',
            'schema_markup' => 'nullable',
            'categories' => 'nullable|array', // Ensure this is an array
            'categories.*' => 'exists:product_categories,id', // Validate each category ID
            'regular_price' => 'required|numeric',
            'sale_price' => 'nullable|numeric',
            'sku' => 'nullable',
            'stock_status' => 'required',
            'status' => 'required',
            'images' => 'nullable|array', // Ensure this is an array
            'images.*' => 'exists:images,id', // Validate each image ID
        ]);

        // Update the product
        $product->update($validated);

        // Sync categories and images
        if (isset($validated['categories'])) {
            $product->categories()->sync($validated['categories']);
        }

        if (isset($validated['images'])) {
            $product->images()->sync($validated['images']);
        }

        return new ProductResource($product);
    }

    // Remove the specified resource from storage
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->noContent();
    }
}
