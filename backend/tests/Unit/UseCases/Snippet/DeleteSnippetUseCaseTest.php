<?php

namespace Tests\Unit\UseCases\Snippet;

use App\Models\Snippet;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use App\UseCases\Snippet\DeleteSnippetUseCase;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class DeleteSnippetUseCaseTest extends TestCase
{
    #[Test]
    public function スニペットが削除されること(): void
    {
        $snippet = Mockery::mock(Snippet::class);
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $repository->shouldReceive('delete')
            ->once()
            ->with($snippet);

        $useCase = new DeleteSnippetUseCase($repository);
        $useCase->execute($snippet);

        $this->assertTrue(true);
    }
}
