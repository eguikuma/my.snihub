<?php

namespace App\Repositories\Interfaces;

use App\Models\User;

/**
 * ユーザーを起点としたデータ操作の契約を定義する
 */
interface UserRepositoryInterface
{
    /**
     * ユーザーに関連するリレーションをロードする
     */
    public function load(User $user): User;
}
