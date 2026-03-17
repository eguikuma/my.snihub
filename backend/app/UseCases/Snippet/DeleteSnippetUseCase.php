<?php

namespace App\UseCases\Snippet;

use App\Models\Snippet;
use App\Models\User;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use Illuminate\Auth\Access\AuthorizationException;

/**
 * スニペットを削除する
 */
class DeleteSnippetUseCase
{
    public function __construct(
        private SnippetRepositoryInterface $snippetRepository,
    ) {}

    public function execute(Snippet $snippet, User $user): void
    {
        if ($user->id !== $snippet->user_id) {
            throw new AuthorizationException;
        }

        $this->snippetRepository->delete($snippet);
    }
}
