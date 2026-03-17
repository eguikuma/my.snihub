<?php

namespace App\Providers;

use App\Repositories\Eloquent\SnippetRepository;
use App\Repositories\Eloquent\TagRepository;
use App\Repositories\Eloquent\UserRepository;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use App\Repositories\Interfaces\TagRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\ServiceProvider;

/**
 * リポジトリのインターフェースと実装をバインドする
 */
class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * サービスの登録
     */
    public function register(): void
    {
        $this->app->bind(SnippetRepositoryInterface::class, SnippetRepository::class);
        $this->app->bind(TagRepositoryInterface::class, TagRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    }
}
