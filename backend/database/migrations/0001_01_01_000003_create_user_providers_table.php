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
        Schema::create('user_providers', function (Blueprint $table) {
            $table->comment('ユーザー認証プロバイダー');

            $table->id()->comment('ID');
            $table->foreignId('user_id')->comment('ユーザーID')->constrained()->cascadeOnDelete();
            $table->string('type')->comment('プロバイダー種別（github, google など）');
            $table->string('external_id')->comment('プロバイダー側のユーザーID');
            $table->timestamp('created_at')->nullable()->comment('作成日時');
            $table->timestamp('updated_at')->nullable()->comment('更新日時');

            $table->index('user_id');
            $table->unique(['type', 'external_id']);
        });
    }

    /**
     * ロールバック
     */
    public function down(): void
    {
        Schema::dropIfExists('user_providers');
    }
};
