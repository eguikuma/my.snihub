<?php

use App\Http\Controllers\Api\SnippetController;
use Illuminate\Support\Facades\Route;

/**
 * 共有リンクによる閲覧は認証不要
 */
Route::get('snippets/{slug}', [SnippetController::class, 'show'])->name('snippets.show');

/**
 * 認証必須
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('snippets', SnippetController::class)
        ->parameters(['snippets' => 'slug'])
        ->except('show');
});
