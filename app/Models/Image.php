<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;

    protected $fillable = [
        'url',
        'name',
        'alt',
        'caption',
    ];

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'image_post'); // Assuming the pivot table is named 'image_post'
    }
    public function products()
    {
        return $this->belongsToMany(Product::class, 'image_product');
    }
}
