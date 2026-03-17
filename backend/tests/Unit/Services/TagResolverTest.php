<?php

namespace Tests\Unit\Services;

use App\Models\Tag;
use App\Repositories\Interfaces\TagRepositoryInterface;
use App\Services\TagResolver;
use Illuminate\Database\Eloquent\Collection;
use Mockery;
use Mockery\MockInterface;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TagResolverTest extends TestCase
{
    private TagRepositoryInterface&MockInterface $tagRepository;

    private TagResolver $tagResolver;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tagRepository = Mockery::mock(TagRepositoryInterface::class);
        $this->tagResolver = new TagResolver($this->tagRepository);
    }

    #[Test]
    public function タグ名が小文字に正規化されること(): void
    {
        $tag = new Tag;
        $tag->id = 1;
        $tag->name = 'php';
        $this->tagRepository->shouldReceive('find')
            ->once()
            ->with(['php'])
            ->andReturn(new Collection([$tag]));

        $result = $this->tagResolver->resolve(['PHP']);

        $this->assertSame([1], $result);
    }

    #[Test]
    public function 既存タグはそのまま使われること(): void
    {
        $tag1 = new Tag;
        $tag1->id = 1;
        $tag1->name = 'php';
        $tag2 = new Tag;
        $tag2->id = 2;
        $tag2->name = 'laravel';
        $this->tagRepository->shouldReceive('find')
            ->once()
            ->with(['php', 'laravel'])
            ->andReturn(new Collection([$tag1, $tag2]));

        $result = $this->tagResolver->resolve(['php', 'laravel']);

        $this->assertSame([1, 2], $result);
    }

    #[Test]
    public function 存在しないタグが新規作成されること(): void
    {
        $existingTag = new Tag;
        $existingTag->id = 1;
        $existingTag->name = 'php';
        $newTag = new Tag;
        $newTag->id = 2;
        $newTag->name = 'laravel';
        $this->tagRepository->shouldReceive('find')
            ->once()
            ->with(['php', 'laravel'])
            ->andReturn(new Collection([$existingTag]));
        $this->tagRepository->shouldReceive('create')
            ->once()
            ->with('laravel')
            ->andReturn($newTag);

        $result = $this->tagResolver->resolve(['php', 'laravel']);

        $this->assertSame([1, 2], $result);
    }

    #[Test]
    public function 空配列の場合、空配列を返すこと(): void
    {
        $result = $this->tagResolver->resolve([]);

        $this->assertSame([], $result);
    }
}
