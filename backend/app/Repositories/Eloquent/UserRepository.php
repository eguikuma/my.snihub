<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;

/**
 * Eloquent を使用したユーザーのデータ操作を実装する
 */
class UserRepository implements UserRepositoryInterface
{
    public function load(User $user): User
    {
        return $user->load('userProviders');
    }
}
