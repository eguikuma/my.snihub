<?php

namespace App\UseCases\Authentication;

use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * 現在のアクセストークンを失効させてログアウトする
 */
class LogoutUseCase
{
    public function execute(User $user): void
    {
        /** @var PersonalAccessToken $token */
        $token = $user->currentAccessToken();

        $token->delete();
    }
}
