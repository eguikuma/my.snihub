<?php

namespace Tests\Unit\UseCases\Snippet;

use App\Enums\ExpiresIn;
use App\Models\Snippet;
use App\Models\User;
use App\Repositories\Dtos as RepositoryDtos;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use App\Services\TagResolver;
use App\UseCases\Snippet\CreateSnippetUseCase;
use App\UseCases\Snippet\Dtos\SnippetCreateDto;
use Illuminate\Support\Carbon;
use Mockery;
use Mockery\MockInterface;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CreateSnippetUseCaseTest extends TestCase
{
    private SnippetRepositoryInterface&MockInterface $snippetRepository;

    private TagResolver&MockInterface $tagResolver;

    private CreateSnippetUseCase $useCase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->snippetRepository = Mockery::mock(SnippetRepositoryInterface::class);
        $this->tagResolver = Mockery::mock(TagResolver::class);
        $this->useCase = new CreateSnippetUseCase($this->snippetRepository, $this->tagResolver);
    }

    #[Test]
    public function スニペットが作成されること(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $this->snippetRepository->shouldReceive('create')
            ->once()
            ->with(Mockery::type(RepositoryDtos\SnippetCreateDto::class))
            ->andReturn($snippet);
        $dto = new SnippetCreateDto(
            title: 'Test',
            code: 'echo "hello";',
            language: 'php',
        );

        $result = $this->useCase->execute($user, $dto);

        $this->assertSame($snippet, $result);
    }

    #[Test]
    public function expiresInが1hの場合、1時間後のexpiresAtに変換されること(): void
    {
        Carbon::setTestNow('2026-03-16 12:00:00');
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $capturedDto = null;
        $this->snippetRepository->shouldReceive('create')
            ->once()
            ->with(Mockery::capture($capturedDto))
            ->andReturn($snippet);
        $dto = new SnippetCreateDto(
            title: 'Test',
            code: 'code',
            language: 'php',
            expiresIn: ExpiresIn::OneHour,
        );

        $this->useCase->execute($user, $dto);

        $this->assertInstanceOf(Carbon::class, $capturedDto?->expiresAt);
        $this->assertTrue($capturedDto?->expiresAt->equalTo('2026-03-16 13:00:00'));
        Carbon::setTestNow();
    }

    #[Test]
    public function expiresInが1dの場合、1日後のexpiresAtに変換されること(): void
    {
        Carbon::setTestNow('2026-03-16 12:00:00');
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $capturedDto = null;
        $this->snippetRepository->shouldReceive('create')
            ->once()
            ->with(Mockery::capture($capturedDto))
            ->andReturn($snippet);
        $dto = new SnippetCreateDto(
            title: 'Test',
            code: 'code',
            language: 'php',
            expiresIn: ExpiresIn::OneDay,
        );

        $this->useCase->execute($user, $dto);

        $this->assertInstanceOf(Carbon::class, $capturedDto?->expiresAt);
        $this->assertTrue($capturedDto?->expiresAt->equalTo('2026-03-17 12:00:00'));
        Carbon::setTestNow();
    }

    #[Test]
    public function expiresInが1wの場合、1週間後のexpiresAtに変換されること(): void
    {
        Carbon::setTestNow('2026-03-16 12:00:00');
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $capturedDto = null;
        $this->snippetRepository->shouldReceive('create')
            ->once()
            ->with(Mockery::capture($capturedDto))
            ->andReturn($snippet);
        $dto = new SnippetCreateDto(
            title: 'Test',
            code: 'code',
            language: 'php',
            expiresIn: ExpiresIn::OneWeek,
        );

        $this->useCase->execute($user, $dto);

        $this->assertInstanceOf(Carbon::class, $capturedDto?->expiresAt);
        $this->assertTrue($capturedDto?->expiresAt->equalTo('2026-03-23 12:00:00'));
        Carbon::setTestNow();
    }

    #[Test]
    public function expiresInがnullの場合、expiresAtもnullになること(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $capturedDto = null;
        $this->snippetRepository->shouldReceive('create')
            ->once()
            ->with(Mockery::capture($capturedDto))
            ->andReturn($snippet);
        $dto = new SnippetCreateDto(
            title: 'Test',
            code: 'code',
            language: 'php',
            expiresIn: null,
        );

        $this->useCase->execute($user, $dto);

        $this->assertNull($capturedDto?->expiresAt);
    }

    #[Test]
    public function タグがTagResolverで解決されてリポジトリDTOに含まれること(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $this->tagResolver->shouldReceive('resolve')
            ->once()
            ->with(['PHP', 'Laravel'])
            ->andReturn([1, 2]);
        $capturedDto = null;
        $this->snippetRepository->shouldReceive('create')
            ->once()
            ->with(Mockery::capture($capturedDto))
            ->andReturn($snippet);
        $dto = new SnippetCreateDto(
            title: 'Test',
            code: 'code',
            language: 'php',
            tags: ['PHP', 'Laravel'],
        );

        $this->useCase->execute($user, $dto);

        $this->assertSame([1, 2], $capturedDto?->tagIds);
    }
}
