<?php

namespace App\UseCases\Snippet;

use App\Enums\ExpiresIn;
use App\Enums\Visibility;
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

    public function execute(SnippetCreateDto $dto, User $user): Snippet
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
            expiresAt: $this->toExpiresAt($dto->expiresIn),
            expiresIn: $dto->expiresIn,
            /**
             * 公開範囲が未指定の場合、デフォルトで限定共有になる
             */
            visibility: $dto->visibility ?? Visibility::Unlisted,
            tagIds: $tagIds,
        );

        return $this->snippetRepository->create($repositoryDto);
    }

    /**
     * 有効期限の種別から、実際の有効期限日時に変換する
     */
    private function toExpiresAt(?ExpiresIn $expiresIn): ?Carbon
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
