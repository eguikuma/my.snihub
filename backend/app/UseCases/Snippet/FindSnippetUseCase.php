<?php

namespace App\UseCases\Snippet;

use App\Enums\Visibility;
use App\Models\Snippet;
use App\Models\User;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * slug でスニペットを取得する
 */
class FindSnippetUseCase
{
    public function __construct(
        private SnippetRepositoryInterface $snippetRepository,
    ) {}

    public function execute(string $slug, ?User $user = null): Snippet
    {
        $snippet = $this->snippetRepository->find($slug);

        if ($snippet === null) {
            throw new ModelNotFoundException;
        }

        /**
         * 期限切れスニペットは、作成者のみ物理削除まで閲覧を許可する
         */
        if ($snippet->is_expired && $user?->id !== $snippet->user_id) {
            throw new ModelNotFoundException;
        }

        /**
         * 非公開スニペットは、作成者以外からは見えないようにする
         */
        if ($snippet->visibility === Visibility::Private && $user?->id !== $snippet->user_id) {
            throw new ModelNotFoundException;
        }

        return $snippet;
    }
}
