<?php

namespace Tests\Unit\UseCases\Snippet;

use App\Models\Snippet;
use App\Repositories\Dtos as RepositoryDtos;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use App\Services\TagResolver;
use App\UseCases\Snippet\Dtos\SnippetUpdateDto;
use App\UseCases\Snippet\UpdateSnippetUseCase;
use Mockery;
use Mockery\MockInterface;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UpdateSnippetUseCaseTest extends TestCase
{
    private SnippetRepositoryInterface&MockInterface $snippetRepository;

    private TagResolver&MockInterface $tagResolver;

    private UpdateSnippetUseCase $useCase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->snippetRepository = Mockery::mock(SnippetRepositoryInterface::class);
        $this->tagResolver = Mockery::mock(TagResolver::class);
        $this->useCase = new UpdateSnippetUseCase($this->snippetRepository, $this->tagResolver);
    }

    #[Test]
    public function スニペットが更新されること(): void
    {
        $snippet = Mockery::mock(Snippet::class);
        $updatedSnippet = Mockery::mock(Snippet::class);
        $this->snippetRepository->shouldReceive('update')
            ->once()
            ->with($snippet, Mockery::type(RepositoryDtos\SnippetUpdateDto::class))
            ->andReturn($updatedSnippet);

        $dto = new SnippetUpdateDto(
            title: 'Updated',
            code: 'new code',
            language: 'php',
        );
        $result = $this->useCase->execute($snippet, $dto);

        $this->assertSame($updatedSnippet, $result);
    }

    #[Test]
    public function タグがTagResolverで解決されてリポジトリDTOに含まれること(): void
    {
        $snippet = Mockery::mock(Snippet::class);
        $updatedSnippet = Mockery::mock(Snippet::class);
        $this->tagResolver->shouldReceive('resolve')
            ->once()
            ->with(['React', 'Hooks'])
            ->andReturn([1, 2]);
        $capturedDto = null;
        $this->snippetRepository->shouldReceive('update')
            ->once()
            ->with($snippet, Mockery::capture($capturedDto))
            ->andReturn($updatedSnippet);

        $dto = new SnippetUpdateDto(
            title: 'Updated',
            code: 'code',
            language: 'php',
            tags: ['React', 'Hooks'],
        );
        $this->useCase->execute($snippet, $dto);

        $this->assertSame([1, 2], $capturedDto?->tagIds);
    }
}
