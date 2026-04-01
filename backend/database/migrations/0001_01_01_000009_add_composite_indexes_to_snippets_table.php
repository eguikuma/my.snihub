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
        Schema::table('snippets', function (Blueprint $table) {
            $table->index(['user_id', 'created_at'], 'snippets_user_id_created_at_index')
                ->comment('ユーザーのスニペット一覧を作成日順で取得するクエリを高速化する');
        });
    }

    /**
     * ロールバック
     */
    public function down(): void
    {
        Schema::table('snippets', function (Blueprint $table) {
            $table->dropIndex('snippets_user_id_created_at_index');
        });
    }
};
