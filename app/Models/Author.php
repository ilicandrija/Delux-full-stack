<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
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

    public function posts()
    {
        return $this->hasMany(Post::class, 'author_id'); // Specify the foreign key
    }
}
