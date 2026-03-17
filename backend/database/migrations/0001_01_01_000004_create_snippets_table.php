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
        Schema::create('snippets', function (Blueprint $table) {
            $table->comment('コードスニペット');

            $table->id()->comment('スニペットID');
            $table->foreignId('user_id')->comment('作成者のユーザーID')->constrained()->cascadeOnDelete();
            $table->string('slug', 16)->unique()->comment('共有用スラッグ');
            $table->string('title')->comment('タイトル');
            $table->text('code')->comment('コード本文');
            $table->string('language', 50)->comment('プログラミング言語');
            $table->text('description')->nullable()->comment('説明');
            $table->timestamp('expires_at')->nullable()->comment('有効期限（null = 無期限）');
            $table->timestamp('created_at')->nullable()->comment('作成日時');
            $table->timestamp('updated_at')->nullable()->comment('更新日時');

            $table->index('user_id');
            $table->index('language');
            $table->index('created_at');
            $table->index('expires_at');
        });
    }

    /**
     * ロールバック
     */
    public function down(): void
    {
        Schema::dropIfExists('snippets');
    }
};
