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
        Schema::create('cache', function (Blueprint $table) {
            $table->comment('キャッシュ');

            $table->string('key')->primary()->comment('キャッシュキー');
            $table->mediumText('value')->comment('キャッシュ値');
            $table->integer('expiration')->index()->comment('有効期限（UNIXタイムスタンプ）');
        });

        Schema::create('cache_locks', function (Blueprint $table) {
            $table->comment('キャッシュロック');

            $table->string('key')->primary()->comment('ロックキー');
            $table->string('owner')->comment('ロック所有者');
            $table->integer('expiration')->index()->comment('有効期限（UNIXタイムスタンプ）');
        });
    }

    /**
     * ロールバック
     */
    public function down(): void
    {
        Schema::dropIfExists('cache');
        Schema::dropIfExists('cache_locks');
    }
};
