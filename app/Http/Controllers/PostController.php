<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Http\Resources\PostResource;
use Illuminate\Http\Request;

class PostController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        $posts = Post::all();
        return PostResource::collection($posts);
    }

    // Show the form for creating a new resource
    public function create()
    {
        // Return a view for creating a post if needed
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $validated = $request->validate([
            'url' => 'required|unique:posts',
            'author_id' => 'required|exists:authors,id',
            'title' => 'required',
            'intro' => 'nullable',
            'body' => 'required',
            'featured_image' => 'nullable',
            'meta_title' => 'nullable',
            'meta_description' => 'nullable',
            'keywords' => 'nullable',
            'schema_markup' => 'nullable',
            'status' => 'required|in:draft,published,private',
            'images_id' => 'nullable|array',
            'images_id.*' => 'exists:images,id',
        ]);

        // Create the post
        $post = Post::create($validated);

        // Sync the categories
        if (!empty($validated['categories_id'])) {
            $post->categories()->sync($validated['categories_id']);
        }

        if ($request->has('images')) {
            foreach ($request->input('images') as $imageId) {
                $post->images()->attach($imageId); // Attach by ID
            }
        }

        return new PostResource($post);
    }


    // Display the specified resource
    public function show(Post $post)
    {
        return new PostResource($post);
    }

    // Show the form for editing the specified resource
    public function edit(Post $post)
    {
        // Return a view for editing the post if needed
    }

    // Update the specified resource in storage
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'url' => 'required|unique:posts,url,' . $post->id,
            'author_id' => 'required|exists:authors,id',
            'title' => 'required',
            'intro' => 'nullable',
            'body' => 'required',
            'featured_image' => 'nullable',
            'meta_title' => 'nullable',
            'meta_description' => 'nullable',
            'keywords' => 'nullable',
            'schema_markup' => 'nullable',
            'status' => 'required|in:draft,published,private',
            'categories_id' => 'nullable|array', // Validate as an array
            'categories_id.*' => 'exists:post_categories,id', // Ensure each category ID exists
        ]);

        // Update the post
        $post->update($validated);

        // Sync the categories
        if (!empty($validated['categories_id'])) {
            $post->categories()->sync($validated['categories_id']);
        } else {
            // If no categories are provided, detach all categories
            $post->categories()->detach();
        }

        return new PostResource($post);
    }


    // Remove the specified resource from storage
    public function destroy(Post $post)
    {
        $post->delete();
        return response()->noContent();
    }
}
