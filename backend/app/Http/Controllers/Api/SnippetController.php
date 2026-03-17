<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\IndexSnippetRequest;
use App\Http\Resources\SnippetResource;
use App\UseCases\Snippet\Dtos\SnippetSearchDto;
use App\UseCases\Snippet\FindSnippetUseCase;
use App\UseCases\Snippet\SearchSnippetsUseCase;
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

        return SnippetResource::collection($snippets);
    }

    /**
     * スニペットを取得する
     */
    public function show(string $slug, FindSnippetUseCase $useCase): SnippetResource
    {
        $snippet = $useCase->execute($slug, user: null);

        return SnippetResource::make($snippet);
    }
}
