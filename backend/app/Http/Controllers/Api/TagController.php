<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\IndexTagRequest;
use App\UseCases\Tag\SearchTagsUseCase;
use Illuminate\Http\JsonResponse;

/**
 * タグ操作を担当する
 */
class TagController extends Controller
{
    /**
     * タグ一覧を取得する
     *
     * keyword パラメータが指定されている場合は前方一致検索する
     * 何も指定されていない場合は人気順で返す
     */
    public function index(IndexTagRequest $request, SearchTagsUseCase $useCase): JsonResponse
    {
        $keyword = $request->validated('keyword');

        return response()->json([
            'data' => $useCase->execute($keyword),
        ]);
    }
}
