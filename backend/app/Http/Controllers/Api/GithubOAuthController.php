<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\UseCases\Authentication\GithubOAuthUseCase;
use Illuminate\Http\RedirectResponse;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GithubProvider;

/**
 * GitHub OAuthの認証フローを担当する
 */
class GithubOAuthController extends Controller
{
    /**
     * 認可画面へリダイレクトする
     */
    public function redirect(): RedirectResponse
    {
        /** @var GithubProvider $driver */
        $driver = Socialite::driver('github');

        return $driver->stateless()->redirect();
    }

    /**
     * コールバックを受け取り、認証後にフロントエンドへリダイレクトする
     */
    public function callback(GithubOAuthUseCase $useCase): RedirectResponse
    {
        /** @var GithubProvider $driver */
        $driver = Socialite::driver('github');

        $socialiteUser = $driver->stateless()->user();
        ['token' => $token] = $useCase->execute($socialiteUser);

        return redirect(config('app.oauth_callback_url')."?token={$token}");
    }
}
