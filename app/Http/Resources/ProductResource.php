<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'url' => $this->url,
            'title' => $this->title,
            'intro' => $this->intro,
            'body' => $this->body,
            'featured_image' => $this->featured_image,
            'gallery' => $this->gallery,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'keywords' => $this->keywords,
            'schema_markup' => $this->schema_markup,
            'regular_price' => $this->regular_price,
            'sale_price' => $this->sale_price,
            'sku' => $this->sku,
            'stock_status' => $this->stock_status,
            'status' => $this->status,
            'categories' => $this->categories->pluck('id'),
            'categories_name' => $this->categories->pluck('title'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
