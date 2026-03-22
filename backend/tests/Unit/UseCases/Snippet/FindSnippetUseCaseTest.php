<?php

namespace Tests\Unit\UseCases\Snippet;

use App\Enums\Visibility;
use App\Models\Snippet;
use App\Models\User;
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
        $snippet->shouldReceive('getAttribute')->with('visibility')->andReturn(Visibility::Unlisted);
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
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(1);
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

    #[Test]
    public function 期限切れスニペットでも作成者は取得できること(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('is_expired')->andReturn(true);
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(1);
        $snippet->shouldReceive('getAttribute')->with('visibility')->andReturn(Visibility::Public);
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $repository->shouldReceive('find')->with('expired1')->andReturn($snippet);
        $useCase = new FindSnippetUseCase($repository);

        $result = $useCase->execute(slug: 'expired1', user: $user);

        $this->assertSame($snippet, $result);
    }

    #[Test]
    public function 期限切れスニペットは作成者以外からは取得できないこと(): void
    {
        $other = Mockery::mock(User::class);
        $other->shouldReceive('getAttribute')->with('id')->andReturn(99);
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('is_expired')->andReturn(true);
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(1);
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $repository->shouldReceive('find')->with('expired1')->andReturn($snippet);
        $useCase = new FindSnippetUseCase($repository);

        $this->assertThrows(
            fn () => $useCase->execute(slug: 'expired1', user: $other),
            ModelNotFoundException::class,
        );
    }

    #[Test]
    public function 非公開スニペットは作成者のみ取得できること(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('is_expired')->andReturn(false);
        $snippet->shouldReceive('getAttribute')->with('visibility')->andReturn(Visibility::Private);
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(1);
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $repository->shouldReceive('find')->with('abc123')->andReturn($snippet);
        $useCase = new FindSnippetUseCase($repository);

        $result = $useCase->execute(slug: 'abc123', user: $user);

        $this->assertSame($snippet, $result);
    }

    #[Test]
    public function 非公開スニペットは作成者以外からは取得できないこと(): void
    {
        $other = Mockery::mock(User::class);
        $other->shouldReceive('getAttribute')->with('id')->andReturn(99);
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('is_expired')->andReturn(false);
        $snippet->shouldReceive('getAttribute')->with('visibility')->andReturn(Visibility::Private);
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(1);
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $repository->shouldReceive('find')->with('abc123')->andReturn($snippet);
        $useCase = new FindSnippetUseCase($repository);

        $this->assertThrows(
            fn () => $useCase->execute(slug: 'abc123', user: $other),
            ModelNotFoundException::class,
        );
    }

    #[Test]
    public function 非公開スニペットは未認証では取得できないこと(): void
    {
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('is_expired')->andReturn(false);
        $snippet->shouldReceive('getAttribute')->with('visibility')->andReturn(Visibility::Private);
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(1);
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $repository->shouldReceive('find')->with('abc123')->andReturn($snippet);
        $useCase = new FindSnippetUseCase($repository);

        $this->assertThrows(
            fn () => $useCase->execute(slug: 'abc123', user: null),
            ModelNotFoundException::class,
        );
    }

    #[Test]
    public function 限定公開スニペットは未認証でもslugで取得できること(): void
    {
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('is_expired')->andReturn(false);
        $snippet->shouldReceive('getAttribute')->with('visibility')->andReturn(Visibility::Unlisted);
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $repository->shouldReceive('find')->with('abc123')->andReturn($snippet);
        $useCase = new FindSnippetUseCase($repository);

        $result = $useCase->execute(slug: 'abc123', user: null);

        $this->assertSame($snippet, $result);
    }
}
