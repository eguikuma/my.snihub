<?php

use App\Http\Controllers\Api\GithubOAuthController;
use App\Http\Controllers\Api\MySnippetController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\SnippetController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('snippets')->name('snippets.')->group(function () {
    Route::get('/', [SnippetController::class, 'index'])->name('index');
    Route::get('{slug}', [SnippetController::class, 'show'])->name('show');
});

Route::prefix('sessions/oauth')->name('sessions.oauth.')->middleware('throttle:oauth')->group(function () {
    Route::get('github', [GithubOAuthController::class, 'redirect'])->name('github');
    Route::get('github/callback', [GithubOAuthController::class, 'callback'])->name('github.callback');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('me')->name('me.')->group(function () {
        Route::get('/', [UserController::class, 'show'])->name('show');

        Route::prefix('snippets')->name('snippets.')->group(function () {
            Route::get('/', [MySnippetController::class, 'index'])->name('index');
            Route::get('{slug}', [MySnippetController::class, 'show'])->name('show');
            Route::post('/', [MySnippetController::class, 'store'])->name('store');
            Route::put('{slug}', [MySnippetController::class, 'update'])->name('update');
            Route::delete('{slug}', [MySnippetController::class, 'destroy'])->name('destroy');
        });
    });

    Route::delete('sessions/current', [SessionController::class, 'logout'])->name('sessions.destroy');
});
