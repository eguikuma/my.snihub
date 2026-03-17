<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\UseCases\Authentication\LogoutUseCase;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * セッションの管理を担当する
 */
class SessionController extends Controller
{
    /**
     * 現在のアクセストークンを失効させてログアウトする
     */
    public function logout(Request $request, LogoutUseCase $useCase): Response
    {
        $useCase->execute($request->user());

        return response()->noContent();
    }
}
