<?php

use App\Http\Controllers\AuthorController;
use App\Http\Controllers\PostCategoryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ImageUploadController;

// Public routes (no authentication)
Route::get('/recipes/all', [RecipeController::class, 'allRecipes']);
Route::apiResource('recipes', RecipeController::class)->only('index', 'show');
Route::apiResource('ingredients', IngredientController::class)->only('index', 'show');
Route::apiResource('posts', PostController::class)->only('index', 'show');
Route::apiResource('products', ProductController::class)->only('index', 'show');
Route::apiResource('authors', AuthorController::class)->only('index', 'show');
Route::apiResource('product_categories', ProductCategoryController::class)->only('index', 'show');
Route::apiResource('post_categories', PostCategoryController::class)->only('index', 'show');

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('ingredients', IngredientController::class)->except('index', 'show');
    Route::apiResource('authors', AuthorController::class)->except('index', 'show');
    Route::apiResource('product_categories', ProductCategoryController::class)->except('index', 'show');
    Route::apiResource('products', ProductController::class)->except('index', 'show');
    Route::apiResource('post_categories', PostCategoryController::class)->except('index', 'show');
    Route::apiResource('posts', PostController::class)->except('index', 'show');

    Route::get('/cart-items', [CartItemController::class, 'index']);
    Route::delete('/cart-items/{id}', [CartItemController::class, 'destroy']);
    Route::post('/cart-items', [CartItemController::class, 'store']);

    // Route to get the authenticated user's information
    Route::get('/user', [AuthController::class, 'getUser']); // Add this line

    // Image upload route (accessible to authenticated users)
    Route::post('/upload-image', [ImageUploadController::class, 'uploadImage']);
    Route::get('/media-library', [ImageUploadController::class, 'listImages']); // Adjust middleware as needed
    Route::options('/upload-image', function () {
        return response()->json([], 200);
    });
});

// Authentication routes
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);


// Admin-specific routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('recipes', RecipeController::class)->except('index', 'show'); // This already includes update (PUT)
    Route::post('/recipes', [RecipeController::class, 'store']); // Only admin can add recipes
});
