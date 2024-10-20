<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'url',
        'title',
        'intro',
        'body',
        'featured_image',
        'gallery',
        'meta_title',
        'meta_description',
        'keywords',
        'schema_markup',
        'regular_price',
        'sale_price',
        'sku',
        'stock_status',
        'status',
    ];

    // Example relationship with categories

    public function categories()
    {
        return $this->belongsToMany(ProductCategory::class,'category_product');// Specify the foreign key
    }

    public function images()
    {
        return $this->belongsToMany(Image::class, 'image_product'); // Assuming the pivot table is named 'image_post'
    }
}
