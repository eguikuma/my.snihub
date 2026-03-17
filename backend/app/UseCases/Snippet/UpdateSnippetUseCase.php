<?php

namespace App\UseCases\Snippet;

use App\Models\Snippet;
use App\Models\User;
use App\Repositories\Dtos as RepositoryDtos;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use App\Services\TagResolver;
use App\UseCases\Snippet\Dtos\SnippetUpdateDto;
use Illuminate\Auth\Access\AuthorizationException;

/**
 * スニペットを更新する
 */
class UpdateSnippetUseCase
{
    public function __construct(
        private SnippetRepositoryInterface $snippetRepository,
        private TagResolver $tagResolver,
    ) {}

    public function execute(User $user, Snippet $snippet, SnippetUpdateDto $dto): Snippet
    {
        if ($user->id !== $snippet->user_id) {
            throw new AuthorizationException;
        }

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
