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
        Schema::create('users', function (Blueprint $table) {
            $table->comment('ユーザー');

            $table->id()->comment('ユーザーID');
            $table->string('name')->comment('表示名');
            $table->string('email')->unique()->nullable()->comment('メールアドレス（null = OAuthプロバイダーから取得できない）');
            $table->string('avatar_url', 2048)->nullable()->comment('アバター画像URL');
            $table->timestamp('created_at')->nullable()->comment('作成日時');
            $table->timestamp('updated_at')->nullable()->comment('更新日時');
        });
    }

    /**
     * ロールバック
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
