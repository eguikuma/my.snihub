<?php

namespace Tests\Unit\UseCases\Snippet;

use App\Models\User;
use App\Repositories\Dtos\SnippetCountDto;
use App\Repositories\Enums\SnippetGroupBy;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use App\UseCases\Snippet\GetSnippetStatisticsUseCase;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class GetSnippetStatisticsUseCaseTest extends TestCase
{
    #[Test]
    public function リポジトリにvisibilityグルーピングのDTOが渡されること(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(42);
        $capturedDto = null;
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $repository->shouldReceive('count')
            ->once()
            ->with(Mockery::capture($capturedDto))
            ->andReturn(['public' => 1]);
        $useCase = new GetSnippetStatisticsUseCase($repository);

        $useCase->execute($user);

        $this->assertInstanceOf(SnippetCountDto::class, $capturedDto);
        $this->assertSame(42, $capturedDto?->userId);
        $this->assertSame(SnippetGroupBy::Visibility, $capturedDto?->groupBy);
    }

    #[Test]
    public function リポジトリの結果をtotal計算と0埋めして返すこと(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $repository->shouldReceive('count')
            ->andReturn(['public' => 3, 'unlisted' => 2]);
        $useCase = new GetSnippetStatisticsUseCase($repository);

        $result = $useCase->execute($user);

        $this->assertSame([
            'total' => 5,
            'public' => 3,
            'unlisted' => 2,
            'private' => 0,
        ], $result);
    }

    #[Test]
    public function リポジトリが空配列を返した場合、すべて0を返すこと(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $repository->shouldReceive('count')
            ->andReturn([]);
        $useCase = new GetSnippetStatisticsUseCase($repository);

        $result = $useCase->execute($user);

        $this->assertSame([
            'total' => 0,
            'public' => 0,
            'unlisted' => 0,
            'private' => 0,
        ], $result);
    }
}
