<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'url',
        'title',
        'intro',
        'body',
        'featured_image',
        'meta_title',
        'meta_description',
        'keywords',
        'schema_markup',
        'status',
        'author'
    ];

    // Example relationship with author
    public function author()
    {
        return $this->belongsTo(Author::class, 'author_id'); // Specify the foreign key
    }

    public function images()
    {
        return $this->belongsToMany(Image::class, 'image_post'); // Assuming the pivot table is named 'image_post'
    }
}
