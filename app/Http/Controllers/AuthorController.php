<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Http\Resources\AuthorResource; // Assuming you created an AuthorResource
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        $authors = Author::all();
        return AuthorResource::collection($authors);
    }

    // Show the form for creating a new resource
    public function create()
    {
        // Return a view for creating an author if needed
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $validated = $request->validate([
            'url' => 'required|unique:authors',
            'title' => 'required',
            'intro' => 'nullable',
            'body' => 'required',
            'featured_image' => 'nullable',
            'meta_title' => 'nullable',
            'meta_description' => 'nullable',
            'keywords' => 'nullable',
            'schema_markup' => 'nullable',
        ]);

        $author = Author::create($validated);
        return new AuthorResource($author);
    }

    // Display the specified resource
    public function show(Author $author)
    {
        return new AuthorResource($author);
    }

    // Show the form for editing the specified resource
    public function edit(Author $author)
    {
        // Return a view for editing the author if needed
    }

    // Update the specified resource in storage
    public function update(Request $request, Author $author)
    {
        $validated = $request->validate([
            'url' => 'required|unique:authors,url,' . $author->id,
            'title' => 'required',
            'intro' => 'nullable',
            'body' => 'required',
            'featured_image' => 'nullable',
            'meta_title' => 'nullable',
            'meta_description' => 'nullable',
            'keywords' => 'nullable',
            'schema_markup' => 'nullable',
        ]);

        $author->update($validated);
        return new AuthorResource($author);
    }

    // Remove the specified resource from storage
    public function destroy(Author $author)
    {
        $author->delete();
        return response()->noContent();
    }
}
