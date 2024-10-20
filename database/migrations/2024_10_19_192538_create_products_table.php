<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // This is the ID column
            $table->string('url')->unique();
            $table->timestamp('published')->nullable();
            $table->timestamp('updated')->nullable();
            $table->enum('status', ['draft', 'private', 'published'])->default('draft');
            $table->string('title');
            $table->text('intro')->nullable();
            $table->longText('body');
            $table->string('featured_image')->nullable();
            $table->json('gallery')->nullable(); // Storing multiple images for the gallery
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->text('keywords')->nullable();
            $table->longText('schema_markup')->nullable();
            $table->json('categories')->nullable(); // Use JSON for multiple categories
            $table->decimal('regular_price', 8, 2); // Regular price with two decimal places
            $table->decimal('sale_price', 8, 2)->nullable(); // Sale price, can be null
            $table->string('sku')->unique(); // Unique SKU (Stock Keeping Unit)
            $table->enum('stock_status', ['in_stock', 'out_of_stock'])->default('out_of_stock');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }

};
