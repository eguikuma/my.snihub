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
            $table->string('expires_in', 2)
                ->nullable()
                ->after('expires_at')
                ->comment('有効期限の種別（1h/1d/1w、null = 無期限）');
        });
    }

    /**
     * ロールバック
     */
    public function down(): void
    {
        Schema::table('snippets', function (Blueprint $table) {
            $table->dropColumn('expires_in');
        });
    }
};
