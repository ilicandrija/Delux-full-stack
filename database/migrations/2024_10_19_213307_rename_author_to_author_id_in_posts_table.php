<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameAuthorToAuthorIdInPostsTable extends Migration
{
    public function up()
    {
        Schema::table('posts', function (Blueprint $table) {
            // Rename the column
            $table->renameColumn('author', 'author_id');
        });
    }

    public function down()
    {
        Schema::table('posts', function (Blueprint $table) {
            // Revert the change in case of rollback
            $table->renameColumn('author_id', 'author');
        });
    }
}

