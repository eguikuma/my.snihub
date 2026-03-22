<?php

namespace App\Http\Controllers\Api;

use App\Enums\ExpiresIn;
use App\Enums\Visibility;
use App\Http\Controllers\Controller;
use App\Http\Requests\IndexSnippetRequest;
use App\Http\Requests\StoreSnippetRequest;
use App\Http\Requests\UpdateSnippetRequest;
use App\Http\Resources\SnippetResource;
use App\UseCases\Snippet\CreateSnippetUseCase;
use App\UseCases\Snippet\DeleteSnippetUseCase;
use App\UseCases\Snippet\Dtos\SnippetCreateDto;
use App\UseCases\Snippet\Dtos\SnippetSearchDto;
use App\UseCases\Snippet\Dtos\SnippetUpdateDto;
use App\UseCases\Snippet\FindSnippetUseCase;
use App\UseCases\Snippet\SearchSnippetsUseCase;
use App\UseCases\Snippet\UpdateSnippetUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

/**
 * 認証ユーザーのスニペット操作を担当する
 */
class MySnippetController extends Controller
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
                visibility: $validated['visibility'] ?? null,
                perPage: $validated['per_page'] ?? 20,
            ),
            $request->user(),
        );

        return SnippetResource::collection($snippets);
    }

    /**
     * スニペットを取得する
     */
    public function show(string $slug, Request $request, FindSnippetUseCase $useCase): SnippetResource
    {
        $snippet = $useCase->execute($slug, $request->user());

        return SnippetResource::make($snippet);
    }

    /**
     * スニペットを新規作成する
     */
    public function store(StoreSnippetRequest $request, CreateSnippetUseCase $useCase): JsonResponse
    {
        $validated = $request->validated();

        $snippet = $useCase->execute(
            new SnippetCreateDto(
                title: $validated['title'],
                code: $validated['code'],
                language: $validated['language'],
                description: $validated['description'] ?? null,
                expiresIn: isset($validated['expires_in'])
                    ? ExpiresIn::from($validated['expires_in'])
                    : null,
                visibility: isset($validated['visibility'])
                    ? Visibility::from($validated['visibility'])
                    : null,
                tags: $validated['tags'] ?? [],
            ),
            $request->user(),
        );

        return SnippetResource::make($snippet)
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * スニペットを更新する
     */
    public function update(string $slug, UpdateSnippetRequest $request, FindSnippetUseCase $findUseCase, UpdateSnippetUseCase $updateUseCase): SnippetResource
    {
        $snippet = $findUseCase->execute($slug, $request->user());

        $validated = $request->validated();

        $snippet = $updateUseCase->execute(
            $snippet,
            new SnippetUpdateDto(
                title: $validated['title'],
                code: $validated['code'],
                language: $validated['language'],
                description: $validated['description'] ?? null,
                visibility: Visibility::from($validated['visibility']),
                tags: $validated['tags'] ?? [],
            ),
            $request->user(),
        );

        return SnippetResource::make($snippet);
    }

    /**
     * スニペットを削除する
     */
    public function destroy(string $slug, Request $request, FindSnippetUseCase $findUseCase, DeleteSnippetUseCase $deleteUseCase): Response
    {
        $snippet = $findUseCase->execute($slug, $request->user());

        $deleteUseCase->execute($snippet, $request->user());

        return response()->noContent();
    }
}
