<?php

namespace Tests\Unit\Repositories;

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
    public function createで、タグが作成されること(): void
    {
        $tag = $this->repository->create('php');

        $this->assertSame('php', $tag->name);
        $this->assertDatabaseHas('tags', ['name' => 'php']);
    }
}
