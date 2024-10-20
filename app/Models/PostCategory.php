<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostCategory extends Model
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
        'schema_markup'
    ];

    // Example relationship with posts
    public function posts()
    {
        return $this->belongsToMany(Post::class, 'category_post'); // Assuming the pivot table is named 'image_post'
    }
}
