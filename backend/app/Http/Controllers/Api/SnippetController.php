<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\IndexSnippetRequest;
use App\Http\Resources\SnippetResource;
use App\Http\Resources\SnippetSummaryResource;
use App\UseCases\Snippet\Dtos\SnippetSearchDto;
use App\UseCases\Snippet\FindSnippetUseCase;
use App\UseCases\Snippet\SearchSnippetsUseCase;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * 公開スニペット操作を担当する
 */
class SnippetController extends Controller
{
    /**
     * スニペット一覧を取得する
     */
    public function index(IndexSnippetRequest $request, SearchSnippetsUseCase $useCase): AnonymousResourceCollection
    {
        $validated = $request->validated();

        $snippets = $useCase->execute(
            new SnippetSearchDto(
                keyword: $validated['keyword'] ?? null,
                tag: $validated['tag'] ?? null,
                language: $validated['language'] ?? null,
                perPage: $validated['per_page'] ?? 20,
            ),
            user: null,
        );

        return SnippetSummaryResource::collection($snippets);
    }

    /**
     * スニペットを取得する
     *
     * Bearerトークンがあれば認証を試み、オーナー判定や非公開スニペットの表示に利用する
     */
    public function show(string $slug, Request $request, FindSnippetUseCase $useCase): SnippetResource
    {
        $snippet = $useCase->execute($slug, $request->user('sanctum'));

        return SnippetResource::make($snippet);
    }
}
