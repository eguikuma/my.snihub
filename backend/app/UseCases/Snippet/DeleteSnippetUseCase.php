<?php

namespace App\UseCases\Snippet;

use App\Models\Snippet;
use App\Repositories\Interfaces\SnippetRepositoryInterface;

/**
 * スニペットを削除する
 */
class DeleteSnippetUseCase
{
    public function __construct(
        private SnippetRepositoryInterface $snippetRepository,
    ) {}

    public function execute(Snippet $snippet): void
    {
        $this->snippetRepository->delete($snippet);
    }
}
