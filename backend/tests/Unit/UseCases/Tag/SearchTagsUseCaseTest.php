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
    public function 全タグ名のコレクションを返すこと(): void
    {
        $tags = new Collection([
            new Tag(['name' => 'javascript']),
            new Tag(['name' => 'php']),
            new Tag(['name' => 'react']),
        ]);
        $repository = Mockery::mock(TagRepositoryInterface::class);
        $repository->shouldReceive('all')
            ->once()
            ->andReturn($tags);
        $useCase = new SearchTagsUseCase($repository);

        $result = $useCase->execute();

        $this->assertCount(3, $result);
        $this->assertSame(['javascript', 'php', 'react'], $result->all());
    }
}
