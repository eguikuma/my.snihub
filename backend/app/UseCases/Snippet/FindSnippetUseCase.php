<?php

namespace App\UseCases\Snippet;

use App\Models\Snippet;
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

    public function execute(string $slug): Snippet
    {
        $snippet = $this->snippetRepository->find($slug);

        if ($snippet === null || $snippet->is_expired) {
            throw new ModelNotFoundException;
        }

        return $snippet;
    }
}
