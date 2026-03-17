<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * マイグレーション実行
     */
    public function up(): void
    {
        Schema::create('snippet_tag', function (Blueprint $table) {
            $table->comment('スニペットとタグの中間テーブル');

            $table->foreignId('snippet_id')->comment('スニペットID')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->comment('タグID')->constrained()->cascadeOnDelete();

            $table->primary(['snippet_id', 'tag_id']);
        });
    }

    /**
     * ロールバック
     */
    public function down(): void
    {
        Schema::dropIfExists('snippet_tag');
    }
};
