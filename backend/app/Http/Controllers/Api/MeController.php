<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\UseCases\User\GetMeUseCase;
use Illuminate\Http\Request;

/**
 * 認証ユーザー操作を担当する
 */
class MeController extends Controller
{
    /**
     * 認証ユーザーを取得する
     */
    public function show(Request $request, GetMeUseCase $useCase): UserResource
    {
        $user = $useCase->execute($request->user());

        return UserResource::make($user);
    }
}
