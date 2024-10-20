<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Http\Resources\PageResource; // Assuming you created a PageResource
use Illuminate\Http\Request;

class PageController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        $pages = Page::all();
        return PageResource::collection($pages);
    }

    // Show the form for creating a new resource
    public function create()
    {
        // Return a view for creating a page if needed
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $validated = $request->validate([
            'url' => 'required|unique:pages',
            'title' => 'required',
            'intro' => 'nullable',
            'body' => 'required',
            'featured_image' => 'nullable',
            'meta_title' => 'nullable',
            'meta_description' => 'nullable',
            'keywords' => 'nullable',
            'schema_markup' => 'nullable',
            'status' => 'required',
        ]);

        $page = Page::create($validated);
        return new PageResource($page);
    }

    // Display the specified resource
    public function show(Page $page)
    {
        return new PageResource($page);
    }

    // Show the form for editing the specified resource
    public function edit(Page $page)
    {
        // Return a view for editing the page if needed
    }

    // Update the specified resource in storage
    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'url' => 'required|unique:pages,url,' . $page->id,
            'title' => 'required',
            'intro' => 'nullable',
            'body' => 'required',
            'featured_image' => 'nullable',
            'meta_title' => 'nullable',
            'meta_description' => 'nullable',
            'keywords' => 'nullable',
            'schema_markup' => 'nullable',
            'status' => 'required',
        ]);

        $page->update($validated);
        return new PageResource($page);
    }

    // Remove the specified resource from storage
    public function destroy(Page $page)
    {
        $page->delete();
        return response()->noContent();
    }
}
