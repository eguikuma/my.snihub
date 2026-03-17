<?php

namespace Tests\Unit\UseCases\Snippet;

use App\Enums\Visibility;
use App\Models\Snippet;
use App\Models\User;
use App\Repositories\Dtos as RepositoryDtos;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use App\Services\TagResolver;
use App\UseCases\Snippet\Dtos\SnippetUpdateDto;
use App\UseCases\Snippet\UpdateSnippetUseCase;
use Illuminate\Auth\Access\AuthorizationException;
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
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(1);
        $updatedSnippet = Mockery::mock(Snippet::class);
        $this->snippetRepository->shouldReceive('update')
            ->once()
            ->with($snippet, Mockery::type(RepositoryDtos\SnippetUpdateDto::class))
            ->andReturn($updatedSnippet);
        $dto = new SnippetUpdateDto(
            title: 'Updated',
            code: 'new code',
            language: 'php',
            visibility: Visibility::Unlisted,
        );

        $result = $this->useCase->execute($snippet, $dto, $user);

        $this->assertSame($updatedSnippet, $result);
    }

    #[Test]
    public function タグがTagResolverで解決されてリポジトリDTOに含まれること(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(1);
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
            visibility: Visibility::Unlisted,
            tags: ['React', 'Hooks'],
        );

        $this->useCase->execute($snippet, $dto, $user);

        $this->assertSame([1, 2], $capturedDto?->tagIds);
    }

    #[Test]
    public function 作成者以外が更新しようとした場合、AuthorizationExceptionが発生すること(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(2);
        $dto = new SnippetUpdateDto(
            title: 'Updated',
            code: 'code',
            language: 'php',
            visibility: Visibility::Unlisted,
        );

        $this->assertThrows(
            fn () => $this->useCase->execute($snippet, $dto, $user),
            AuthorizationException::class,
        );
    }

    #[Test]
    public function visibilityがリポジトリDTOに含まれること(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(1);
        $updatedSnippet = Mockery::mock(Snippet::class);
        $capturedDto = null;
        $this->snippetRepository->shouldReceive('update')
            ->once()
            ->with($snippet, Mockery::capture($capturedDto))
            ->andReturn($updatedSnippet);
        $dto = new SnippetUpdateDto(
            title: 'Updated',
            code: 'new code',
            language: 'php',
            visibility: Visibility::Public,
        );

        $this->useCase->execute($snippet, $dto, $user);

        $this->assertSame(Visibility::Public, $capturedDto?->visibility);
    }
}
