<?php

namespace Tests\Unit\UseCases\Snippet;

use App\Models\Snippet;
use App\Models\User;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use App\UseCases\Snippet\DeleteSnippetUseCase;
use Illuminate\Auth\Access\AuthorizationException;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class DeleteSnippetUseCaseTest extends TestCase
{
    #[Test]
    public function スニペットが削除されること(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(1);
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $repository->shouldReceive('delete')
            ->once()
            ->with($snippet);
        $useCase = new DeleteSnippetUseCase($repository);

        $useCase->execute($snippet, $user);

        $this->assertTrue(true);
    }

    #[Test]
    public function 作成者以外が削除しようとした場合、AuthorizationExceptionが発生すること(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(2);
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $useCase = new DeleteSnippetUseCase($repository);

        $this->assertThrows(
            fn () => $useCase->execute($snippet, $user),
            AuthorizationException::class,
        );
    }
}
