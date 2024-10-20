<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    protected $fillable = ['name', 'short_description', 'prep_time', 'opis', 'written_by', 'sku', 'stock', 'price'];

    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class)->withPivot('quantity');
    }

    public function images()
    {
        return $this->belongsToMany(Image::class);
    }
}
