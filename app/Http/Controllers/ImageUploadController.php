<?php

namespace App\Http\Controllers;

use App\Http\Resources\ImageResource;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageUploadController extends Controller
{
    public function uploadImage(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'file' => 'required|image|max:2048',
            'custom_name' => 'nullable|string',
            'alt' => 'nullable|string',
            'caption' => 'nullable|string',
        ]);

        // Get the file from the request
        $file = $request->file('file');

        // Check if the file is valid
        if (!$file) {
            return response()->json(['error' => 'No file uploaded.'], 400);
        }

        // Create a custom filename
        $customName = $request->input('custom_name', 'default_name'); // Provide a default name
        $extension = $file->getClientOriginalExtension();
        $fileName = $customName . '.' . $extension;

        // Define the path for storage
        $path = "images/" . now()->format('Y/m');

        // Create the directory if it doesn't exist and store the file
        // Create the directory if it doesn't exist and store the file
        try {
            $filePath = $file->storeAs($path, $fileName); // Use storeAs to save the file
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error storing file.'], 500);
        }

        // Create a new image record in the database
        try {
            $image = Image::create([
                'url' => Storage::url($filePath),
                'name' => $customName,
                'alt' => $request->input('alt', ''),
                'caption' => $request->input('caption', ''),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error creating image record.'], 500);
        }

        // Return the created image resource
        return new ImageResource($image);
    }

    public function listImages()
    {
        $images = Image::all(); // Retrieve all images from the database
        return response()->json(['images' => $images]);
    }
}
