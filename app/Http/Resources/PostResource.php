<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'url' => $this->url,
            'status' => $this->status,
            'title' => $this->title,
            'intro' => $this->intro,
            'body' => $this->body,
            'featured_image' => $this->featured_image,
            'author_id' => $this->author_id,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'keywords' => $this->keywords,
            'schema_markup' => $this->schema_markup,
            'categories' => $this->categories->pluck('id'),
            'categories_name' => $this->categories->pluck('name'),// Return the category IDs
            'images' =>$this->images->pluck('id'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

}
