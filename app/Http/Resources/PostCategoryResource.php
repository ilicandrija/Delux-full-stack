<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostCategoryResource extends JsonResource
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
            'title' => $this->title,
            'intro' => $this->intro,
            'body' => $this->body,
            'featured_image' => $this->featured_image,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'keywords' => $this->keywords,
            'schema_markup' => $this->schema_markup,
            // Add other attributes as needed
        ];
    }
}
