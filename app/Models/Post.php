<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'url',
        'status',
        'title',
        'intro',
        'body',
        'featured_image',
        'author_id', // Change 'author' to 'author_id'
        'meta_title',
        'meta_description',
        'keywords',
        'schema_markup',
    ];

    public function author()
    {
        return $this->belongsTo(Author::class, 'author_id'); // Specify the foreign key
    }

    public function categories()
    {
        return $this->belongsToMany(PostCategory::class,'category_post');// Specify the foreign key
    }

    public function images()
    {
        return $this->belongsToMany(Image::class, 'image_post'); // Assuming the pivot table is named 'image_post'
    }
}
