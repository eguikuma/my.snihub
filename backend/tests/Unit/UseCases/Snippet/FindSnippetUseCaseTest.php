<?php

namespace Tests\Unit\UseCases\Snippet;

use App\Models\Snippet;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use App\UseCases\Snippet\FindSnippetUseCase;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FindSnippetUseCaseTest extends TestCase
{
    #[Test]
    public function slugでスニペットを取得できること(): void
    {
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('is_expired')->andReturn(false);
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $repository->shouldReceive('find')
            ->once()
            ->with('abc12345')
            ->andReturn($snippet);

        $useCase = new FindSnippetUseCase($repository);
        $result = $useCase->execute('abc12345');

        $this->assertSame($snippet, $result);
    }

    #[Test]
    public function 存在しないslugの場合、ModelNotFoundExceptionが発生すること(): void
    {
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $repository->shouldReceive('find')
            ->once()
            ->with('nonexist')
            ->andReturnNull();
        $useCase = new FindSnippetUseCase($repository);

        $this->assertThrows(
            fn () => $useCase->execute('nonexist'),
            ModelNotFoundException::class,
        );
    }

    #[Test]
    public function 期限切れスニペットの場合、ModelNotFoundExceptionが発生すること(): void
    {
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('is_expired')->andReturn(true);
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $repository->shouldReceive('find')
            ->once()
            ->with('expired1')
            ->andReturn($snippet);
        $useCase = new FindSnippetUseCase($repository);

        $this->assertThrows(
            fn () => $useCase->execute('expired1'),
            ModelNotFoundException::class,
        );
    }
}
