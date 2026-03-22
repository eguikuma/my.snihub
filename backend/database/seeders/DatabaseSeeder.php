<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * アプリケーションのデータベースにシードデータを投入する
     */
    public function run(): void
    {
        if (app()->environment('local')) {
            $this->call(LocalSeeder::class);
        }
    }
}
