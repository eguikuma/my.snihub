<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * OAuthプロバイダー経由で認証されたユーザーを表す
 */
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'avatar_url',
    ];

    /**
     * ユーザーが作成したスニペットを取得する
     *
     * @return HasMany<Snippet, $this>
     */
    public function snippets(): HasMany
    {
        return $this->hasMany(Snippet::class);
    }

    /**
     * ユーザーに紐づく認証プロバイダーを取得する
     *
     * @return HasMany<UserProvider, $this>
     */
    public function userProviders(): HasMany
    {
        return $this->hasMany(UserProvider::class);
    }
}
