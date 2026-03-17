<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\UseCases\Authentication\GithubOAuthUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * 受け取った認可コードをもとにGitHub認証を完了し、Sanctumトークンを発行する
 */
class GithubOAuthController extends Controller
{
    /**
     * 認可コードを受け取り、Sanctumトークンを返す
     */
    public function authenticate(Request $request, GithubOAuthUseCase $useCase): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        ['token' => $token] = $useCase->execute($request->input('code'));

        return response()->json(['token' => $token]);
    }
}
