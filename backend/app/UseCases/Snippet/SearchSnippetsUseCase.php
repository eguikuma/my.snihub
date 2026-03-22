<?php

namespace App\UseCases\Snippet;

use App\Enums\Visibility;
use App\Models\User;
use App\Repositories\Dtos as RepositoryDtos;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use App\UseCases\Snippet\Dtos\SnippetSearchDto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * 検索条件に基づいてスニペット一覧を取得する
 */
class SearchSnippetsUseCase
{
    public function __construct(
        private SnippetRepositoryInterface $snippetRepository,
    ) {}

    public function execute(SnippetSearchDto $dto, ?User $user = null): LengthAwarePaginator
    {
        $isAuthenticated = $user !== null;
        $hasVisibility = $dto->visibility !== null;

        $repositoryDto = new RepositoryDtos\SnippetSearchDto(
            keyword: $dto->keyword,
            tag: $dto->tag,
            language: $dto->language,
            userId: $user?->id,
            /**
             * 未認証の場合は公開のみ、認証済みの場合はDTO指定のvisibilityで絞り込む
             */
            visibility: ! $isAuthenticated
                ? Visibility::Public
                : ($hasVisibility ? Visibility::from($dto->visibility) : null),
            withExpired: $isAuthenticated,
        );

        return $this->snippetRepository->paginate($repositoryDto, $dto->perPage);
    }
}
