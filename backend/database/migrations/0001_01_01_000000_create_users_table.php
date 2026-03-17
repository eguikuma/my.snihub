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
            $table->string('avatar_url')->nullable()->comment('アバター画像URL');
            $table->timestamp('created_at')->nullable()->comment('作成日時');
            $table->timestamp('updated_at')->nullable()->comment('更新日時');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->comment('パスワードリセットトークン');

            $table->string('email')->primary()->comment('メールアドレス');
            $table->string('token')->comment('リセットトークン');
            $table->timestamp('created_at')->nullable()->comment('作成日時');
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->comment('セッション');

            $table->string('id')->primary()->comment('セッションID');
            $table->foreignId('user_id')->nullable()->index()->comment('ユーザーID');
            $table->string('ip_address', 45)->nullable()->comment('IPアドレス');
            $table->text('user_agent')->nullable()->comment('ユーザーエージェント');
            $table->longText('payload')->comment('ペイロード');
            $table->integer('last_activity')->index()->comment('最終アクティビティ');
        });
    }

    /**
     * ロールバック
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
