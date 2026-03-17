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

        if ($snippet === null || $snippet->is_expired) {
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
