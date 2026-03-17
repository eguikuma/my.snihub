<?php

namespace App\UseCases\User;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;

/**
 * 認証ユーザーを取得する
 */
class GetMeUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
    ) {}

    public function execute(User $user): User
    {
        return $this->userRepository->load($user);
    }
}
