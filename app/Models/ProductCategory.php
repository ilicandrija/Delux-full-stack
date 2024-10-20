<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
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

    // Example relationship with products
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
