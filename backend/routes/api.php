<?php

use App\Http\Controllers\Api\MeController;
use App\Http\Controllers\Api\MySnippetController;
use App\Http\Controllers\Api\SnippetController;
use Illuminate\Support\Facades\Route;

/**
 * 認証不要
 */
Route::prefix('snippets')->name('snippets.')->group(function () {
    Route::get('/', [SnippetController::class, 'index'])->name('index');
    Route::get('{slug}', [SnippetController::class, 'show'])->name('show');
});

/**
 * 認証必要
 */
Route::middleware('auth:sanctum')->prefix('me')->name('me.')->group(function () {
    Route::get('/', [MeController::class, 'show'])->name('show');

    Route::prefix('snippets')->name('snippets.')->group(function () {
        Route::get('/', [MySnippetController::class, 'index'])->name('index');
        Route::get('{slug}', [MySnippetController::class, 'show'])->name('show');
        Route::post('/', [MySnippetController::class, 'store'])->name('store');
        Route::put('{slug}', [MySnippetController::class, 'update'])->name('update');
        Route::delete('{slug}', [MySnippetController::class, 'destroy'])->name('destroy');
    });
});
