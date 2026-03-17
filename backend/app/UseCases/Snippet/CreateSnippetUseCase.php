<?php

namespace App\UseCases\Snippet;

use App\Enums\ExpiresIn;
use App\Models\Snippet;
use App\Models\User;
use App\Repositories\Dtos as RepositoryDtos;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use App\Services\TagResolver;
use App\UseCases\Snippet\Dtos\SnippetCreateDto;
use Illuminate\Support\Carbon;

/**
 * スニペットを新規作成する
 */
class CreateSnippetUseCase
{
    public function __construct(
        private SnippetRepositoryInterface $snippetRepository,
        private TagResolver $tagResolver,
    ) {}

    public function execute(User $user, SnippetCreateDto $dto): Snippet
    {
        $tagIds = ! empty($dto->tags)
            ? $this->tagResolver->resolve($dto->tags)
            : [];

        $repositoryDto = new RepositoryDtos\SnippetCreateDto(
            userId: $user->id,
            title: $dto->title,
            code: $dto->code,
            language: $dto->language,
            description: $dto->description,
            expiresAt: $this->convertExpiresIn($dto->expiresIn),
            tagIds: $tagIds,
        );

        return $this->snippetRepository->create($repositoryDto);
    }

    private function convertExpiresIn(?ExpiresIn $expiresIn): ?Carbon
    {
        if ($expiresIn === null) {
            return null;
        }

        return match ($expiresIn) {
            ExpiresIn::OneHour => Carbon::now()->addHour(),
            ExpiresIn::OneDay => Carbon::now()->addDay(),
            ExpiresIn::OneWeek => Carbon::now()->addWeek(),
        };
    }
}
