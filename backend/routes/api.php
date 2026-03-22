<?php

use App\Http\Controllers\Api\GithubOAuthController;
use App\Http\Controllers\Api\MySnippetController;
use App\Http\Controllers\Api\MySnippetStatisticsController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\SnippetController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\CachePublicResponse;
use Illuminate\Support\Facades\Route;

Route::get('health', fn () => response()->json(['status' => 'ok']))->name('health');

Route::middleware(CachePublicResponse::class)->group(function () {
    Route::prefix('snippets')->name('snippets.')->group(function () {
        Route::get('/', [SnippetController::class, 'index'])->name('index');
        Route::get('{slug}', [SnippetController::class, 'show'])->name('show');
    });

    Route::get('tags', [TagController::class, 'index'])->name('tags.index');
});

Route::prefix('sessions/oauth')->name('sessions.oauth.')->middleware('throttle:oauth')->group(function () {
    Route::post('github', [GithubOAuthController::class, 'authenticate'])->name('github');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('me')->name('me.')->group(function () {
        Route::get('/', [UserController::class, 'show'])->name('show');

        Route::prefix('snippets')->name('snippets.')->group(function () {
            Route::get('statistics', [MySnippetStatisticsController::class, 'show'])->name('statistics');
            Route::get('/', [MySnippetController::class, 'index'])->name('index');
            Route::get('{slug}', [MySnippetController::class, 'show'])->name('show');
            Route::post('/', [MySnippetController::class, 'store'])->name('store');
            Route::put('{slug}', [MySnippetController::class, 'update'])->name('update');
            Route::delete('{slug}', [MySnippetController::class, 'destroy'])->name('destroy');
        });
    });

    Route::delete('sessions/current', [SessionController::class, 'delete'])->name('sessions.destroy');
});
