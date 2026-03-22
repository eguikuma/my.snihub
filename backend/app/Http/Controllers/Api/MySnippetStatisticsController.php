<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\UseCases\Snippet\GetSnippetStatisticsUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * 認証ユーザーのスニペット統計を返す
 */
class MySnippetStatisticsController extends Controller
{
    /**
     * 公開範囲別のスニペット件数を取得する
     */
    public function show(Request $request, GetSnippetStatisticsUseCase $useCase): JsonResponse
    {
        return response()->json(
            $useCase->execute($request->user()),
        );
    }
}
