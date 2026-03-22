<?php

namespace App\UseCases\Snippet;

use App\Enums\Visibility;
use App\Models\User;
use App\Repositories\Dtos\SnippetCountDto;
use App\Repositories\Enums\SnippetGroupBy;
use App\Repositories\Interfaces\SnippetRepositoryInterface;

/**
 * 認証ユーザーのスニペット件数を公開範囲別に集計する
 */
class GetSnippetStatisticsUseCase
{
    public function __construct(
        private SnippetRepositoryInterface $snippetRepository,
    ) {}

    /**
     * @return array<string, int>
     */
    public function execute(User $user): array
    {
        $counts = $this->snippetRepository->count(new SnippetCountDto(
            userId: $user->id,
            groupBy: SnippetGroupBy::Visibility,
        ));

        return [
            'total' => array_sum($counts),
            'public' => $counts[Visibility::Public->value] ?? 0,
            'unlisted' => $counts[Visibility::Unlisted->value] ?? 0,
            'private' => $counts[Visibility::Private->value] ?? 0,
        ];
    }
}
