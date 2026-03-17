<?php

namespace Tests\Unit\UseCases\Tag;

use App\Models\Tag;
use App\Repositories\Interfaces\TagRepositoryInterface;
use App\UseCases\Tag\SearchTagsUseCase;
use Illuminate\Database\Eloquent\Collection;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SearchTagsUseCaseTest extends TestCase
{
    #[Test]
    public function キーワードが未指定の場合、人気タグを返すこと(): void
    {
        $tags = new Collection([
            new Tag(['name' => 'react']),
            new Tag(['name' => 'php']),
            new Tag(['name' => 'javascript']),
        ]);
        $repository = Mockery::mock(TagRepositoryInterface::class);
        $repository->shouldReceive('popular')
            ->with(10)
            ->once()
            ->andReturn($tags);
        $useCase = new SearchTagsUseCase($repository);

        $result = $useCase->execute();

        $this->assertCount(3, $result);
        $this->assertSame(['react', 'php', 'javascript'], $result->all());
    }

    #[Test]
    public function キーワードが指定された場合、検索結果を返すこと(): void
    {
        $tags = new Collection([
            new Tag(['name' => 'react']),
            new Tag(['name' => 'redis']),
        ]);
        $repository = Mockery::mock(TagRepositoryInterface::class);
        $repository->shouldReceive('search')
            ->with('re', 20)
            ->once()
            ->andReturn($tags);
        $useCase = new SearchTagsUseCase($repository);

        $result = $useCase->execute('re');

        $this->assertCount(2, $result);
        $this->assertSame(['react', 'redis'], $result->all());
    }

    #[Test]
    public function 空文字キーワードの場合、人気タグを返すこと(): void
    {
        $tags = new Collection([
            new Tag(['name' => 'laravel']),
        ]);
        $repository = Mockery::mock(TagRepositoryInterface::class);
        $repository->shouldReceive('popular')
            ->with(10)
            ->once()
            ->andReturn($tags);
        $useCase = new SearchTagsUseCase($repository);

        $result = $useCase->execute('');

        $this->assertCount(1, $result);
        $this->assertSame(['laravel'], $result->all());
    }
}
