<?php

namespace App\Policies;

use App\Models\Snippet;
use App\Models\User;

/**
 * スニペットの認可ポリシー
 */
class SnippetPolicy
{
    /**
     * スニペットの更新を認可する
     */
    public function update(User $user, Snippet $snippet): bool
    {
        return $user->id === $snippet->user_id;
    }

    /**
     * スニペットの削除を認可する
     */
    public function delete(User $user, Snippet $snippet): bool
    {
        return $user->id === $snippet->user_id;
    }
}
