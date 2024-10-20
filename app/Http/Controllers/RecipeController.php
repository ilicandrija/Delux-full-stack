<?php

namespace App\Http\Controllers;

use App\Http\Resources\RecipeResource;
use App\Models\Recipe;
use Illuminate\Http\Request;


class RecipeController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 12;
        $recipes = Recipe::paginate($perPage);
        return RecipeResource::collection($recipes);
    }

    public function allRecipes()
    {
        $recipes = Recipe::all();
        return RecipeResource::collection($recipes);
    }

    public function store(Request $request)
    {
        // Validate your incoming request...
        $request->validate([
            'name' => 'required|string|max:255',
            'short_description' => 'required|string',
            'prep_time' => 'required|integer',
            'opis' => 'nullable|string',
            'ingredients' => 'required|array',
            'ingredients.*.id' => 'nullable|integer|exists:ingredients,id',
            'ingredients.*.quantity' => 'nullable|integer|min:0',
            'written_by' => 'nullable|string',
            'sku' => 'nullable|string|unique:recipes',
            'stock' => 'required|boolean',
            'price' => 'nullable|numeric',
            'images' => 'nullable|array',
            'images.*.id' => 'required|integer|exists:images,id',
        ]);

        $recipe = new Recipe();
        $recipe->name = $request->name;
        $recipe->short_description = $request->short_description;
        $recipe->prep_time = $request->prep_time;
        $recipe->opis = $request->opis;
        $recipe->sku = $request->sku;
        $recipe->stock = $request->stock;
        $recipe->price = $request->price;
        $recipe->written_by = auth()->user()->name;

        $recipe->save(); // Save recipe first to get its ID

        // Handle ingredients
        $ingredients = $request->input('ingredients');
        foreach ($ingredients as $ingredient) {
            $recipe->ingredients()->attach($ingredient['id'], ['quantity' => $ingredient['quantity']]);
        }

        // Handle images
        if ($request->has('images')) {
            $images = $request->input('images');
            foreach ($images as $image) {
                $recipe->images()->attach($image['id']);
            }
        }

        return response()->json([
            'message' => 'Recipe created successfully.',
            'recipe' => $recipe,
        ]);
    }

    public function show(Recipe $recipe)
    {
        return new RecipeResource($recipe);
    }

    public function update(Request $request, $id)
    {
        // First, retrieve the recipe to ensure it exists
        $recipe = Recipe::findOrFail($id);

        // Validate the request data
        $request->validate([
            'name' => 'required|string|max:255',
            'short_description' => 'required|string',
            'prep_time' => 'required|integer',
            'sku' => 'nullable|string|unique:recipes,sku,' . $id, // Use $id instead of $recipe->id
            'stock' => 'required|boolean',
            'price' => 'nullable|numeric',
            'ingredients' => 'nullable|array',
            'ingredients.*.id' => 'required|integer|exists:ingredients,id',
            'ingredients.*.quantity' => 'required|integer|min:0',
            'images' => 'nullable|array',
            'images.*.id' => 'required|integer|exists:images,id',
        ]);

        // Update the recipe properties
        $recipe->update($request->only(['name', 'short_description', 'prep_time', 'sku', 'stock', 'price', 'opis']));

        // Handle ingredients
        if ($request->has('ingredients')) {
            $recipe->ingredients()->detach(); // Clear existing ingredients
            foreach ($request->input('ingredients') as $ingredient) {
                $recipe->ingredients()->attach($ingredient['id'], ['quantity' => $ingredient['quantity']]);
            }
        }

        // Handle images
        if ($request->has('images')) {
            $recipe->images()->detach(); // Clear existing images
            foreach ($request->input('images') as $image) {
                $recipe->images()->attach($image['id']);
            }
        }

        return response()->json(['message' => 'Recipe updated successfully', 'data' => new RecipeResource($recipe)]);
    }

    public function destroy(Recipe $recipe)
    {
        $recipe->delete();
        return response()->json(['message' => 'Recipe deleted']);
    }

}
