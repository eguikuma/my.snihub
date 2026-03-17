<?php

namespace App\UseCases\Snippet;

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

    public function execute(User $user, SnippetSearchDto $dto): LengthAwarePaginator
    {
        $repositoryDto = new RepositoryDtos\SnippetSearchDto(
            keyword: $dto->keyword,
            tag: $dto->tag,
            language: $dto->language,
            userId: $user->id,
            withExpired: false,
        );

        return $this->snippetRepository->paginate($repositoryDto, $dto->perPage);
    }
}
