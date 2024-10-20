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
        Schema::create('pages', function (Blueprint $table) {
            $table->id(); // This is the ID column
            $table->string('url')->unique();
            $table->timestamp('published')->nullable();
            $table->timestamp('updated')->nullable();
            $table->enum('status', ['draft', 'private', 'published'])->default('draft');
            $table->string('title');
            $table->text('intro')->nullable();
            $table->longText('body');
            $table->string('featured_image')->nullable();
            $table->string('author');
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->text('keywords')->nullable();
            $table->longText('schema_markup')->nullable();
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('pages');
    }

};