<?php

namespace Tests\Unit\Repositories;

use App\Models\Snippet;
use App\Models\Tag;
use App\Repositories\Eloquent\TagRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TagRepositoryTest extends TestCase
{
    use RefreshDatabase;

    private TagRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->repository = new TagRepository;
    }

    #[Test]
    public function allで、全タグをアルファベット順で取得できること(): void
    {
        Tag::factory()->create(['name' => 'react']);
        Tag::factory()->create(['name' => 'css']);
        Tag::factory()->create(['name' => 'php']);

        $tags = $this->repository->all();

        $this->assertCount(3, $tags);
        $this->assertSame(['css', 'php', 'react'], $tags->pluck('name')->all());
    }

    #[Test]
    public function findで、タグ名の配列から既存タグを取得できること(): void
    {
        Tag::factory()->create(['name' => 'php']);
        Tag::factory()->create(['name' => 'laravel']);
        Tag::factory()->create(['name' => 'react']);

        $tags = $this->repository->find(['php', 'laravel']);

        $this->assertCount(2, $tags);
        $names = $tags->pluck('name')->all();
        $this->assertContains('php', $names);
        $this->assertContains('laravel', $names);
    }

    #[Test]
    public function findで、存在しないタグ名が含まれる場合、既存分のみ返すこと(): void
    {
        Tag::factory()->create(['name' => 'php']);

        $tags = $this->repository->find(['php', 'nonexistent']);

        $this->assertCount(1, $tags);
        $this->assertSame('php', $tags->first()->name);
    }

    #[Test]
    public function popularで、スニペット数の多い順にタグを取得できること(): void
    {
        $tagCss = Tag::factory()->create(['name' => 'css']);
        $tagPhp = Tag::factory()->create(['name' => 'php']);
        $tagReact = Tag::factory()->create(['name' => 'react']);
        Snippet::factory()->public()->create()->tags()->attach($tagCss);
        Snippet::factory()->public()->count(3)->create()->each(
            fn (Snippet $snippet) => $snippet->tags()->attach($tagPhp),
        );
        Snippet::factory()->public()->count(2)->create()->each(
            fn (Snippet $snippet) => $snippet->tags()->attach($tagReact),
        );

        $tags = $this->repository->popular(10);

        $this->assertSame(['php', 'react', 'css'], $tags->pluck('name')->all());
    }

    #[Test]
    public function popularで、指定件数分のみ取得できること(): void
    {
        $tagPhp = Tag::factory()->create(['name' => 'php']);
        $tagReact = Tag::factory()->create(['name' => 'react']);
        $tagCss = Tag::factory()->create(['name' => 'css']);
        Snippet::factory()->public()->count(3)->create()->each(
            fn (Snippet $snippet) => $snippet->tags()->attach($tagPhp),
        );
        Snippet::factory()->public()->count(2)->create()->each(
            fn (Snippet $snippet) => $snippet->tags()->attach($tagReact),
        );
        Snippet::factory()->public()->create()->tags()->attach($tagCss);

        $tags = $this->repository->popular(2);

        $this->assertCount(2, $tags);
        $this->assertSame(['php', 'react'], $tags->pluck('name')->all());
    }

    #[Test]
    public function searchで、前方一致でタグを検索できること(): void
    {
        Tag::factory()->create(['name' => 'react']);
        Tag::factory()->create(['name' => 'redis']);
        Tag::factory()->create(['name' => 'php']);

        $tags = $this->repository->search('re', 20);

        $this->assertCount(2, $tags);
        $names = $tags->pluck('name')->all();
        $this->assertContains('react', $names);
        $this->assertContains('redis', $names);
    }

    #[Test]
    public function searchで、該当なしの場合は空コレクションを返すこと(): void
    {
        Tag::factory()->create(['name' => 'php']);

        $tags = $this->repository->search('xyz', 20);

        $this->assertCount(0, $tags);
    }

    #[Test]
    public function createで、タグが作成されること(): void
    {
        $tag = $this->repository->create('php');

        $this->assertSame('php', $tag->name);
        $this->assertDatabaseHas('tags', ['name' => 'php']);
    }
}
