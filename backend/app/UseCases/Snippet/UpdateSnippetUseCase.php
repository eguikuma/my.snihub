<?php

namespace App\UseCases\Snippet;

use App\Models\Snippet;
use App\Repositories\Dtos as RepositoryDtos;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use App\Services\TagResolver;
use App\UseCases\Snippet\Dtos\SnippetUpdateDto;

/**
 * スニペットを更新する
 */
class UpdateSnippetUseCase
{
    public function __construct(
        private SnippetRepositoryInterface $snippetRepository,
        private TagResolver $tagResolver,
    ) {}

    public function execute(Snippet $snippet, SnippetUpdateDto $dto): Snippet
    {
        $tagIds = ! empty($dto->tags)
            ? $this->tagResolver->resolve($dto->tags)
            : [];

        $repositoryDto = new RepositoryDtos\SnippetUpdateDto(
            title: $dto->title,
            code: $dto->code,
            language: $dto->language,
            description: $dto->description,
            tagIds: $tagIds,
        );

        return $this->snippetRepository->update($snippet, $repositoryDto);
    }
}
