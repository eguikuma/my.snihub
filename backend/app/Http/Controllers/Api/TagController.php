<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\UseCases\Tag\SearchTagsUseCase;
use Illuminate\Http\JsonResponse;

/**
 * タグ操作を担当する
 */
class TagController extends Controller
{
    /**
     * タグ一覧を取得する
     */
    public function index(SearchTagsUseCase $useCase): JsonResponse
    {
        return response()->json(['data' => $useCase->execute()]);
    }
}
