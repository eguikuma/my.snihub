<?php

namespace Tests\Unit\Http\Resources;

use App\Http\Resources\SnippetResource;
use App\Models\Snippet;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SnippetResourceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function スニペットのJSON構造が正しいこと(): void
    {
        $user = User::factory()->create(['name' => 'テストユーザー']);
        $snippet = Snippet::factory()->create([
            'user_id' => $user->id,
            'title' => 'Hello World',
            'code' => 'echo "Hello";',
            'language' => 'php',
            'description' => 'サンプルコード',
            'expires_at' => '2026-12-31 23:59:59',
        ]);
        $tags = Tag::factory()->count(2)->sequence(
            ['name' => 'php'],
            ['name' => 'sample'],
        )->create();
        $snippet->tags()->attach($tags);
        $snippet->load('tags', 'user');

        $resource = SnippetResource::make($snippet)->resolve();

        $this->assertSame($snippet->slug, $resource['slug']);
        $this->assertSame('Hello World', $resource['title']);
        $this->assertSame('echo "Hello";', $resource['code']);
        $this->assertSame('php', $resource['language']);
        $this->assertSame('サンプルコード', $resource['description']);
        $this->assertSame('2026-12-31T23:59:59+00:00', $resource['expires_at']);
        $this->assertSame(['php', 'sample'], $resource['tags']);
        $this->assertSame($user->name, $resource['user']['name']);
        $this->assertNotNull($resource['created_at']);
        $this->assertNotNull($resource['updated_at']);
        $this->assertArrayNotHasKey('id', $resource);
        $this->assertArrayNotHasKey('user_id', $resource);
    }

    #[Test]
    public function 任意項目がnullの場合もJSON構造が正しいこと(): void
    {
        $snippet = Snippet::factory()->create([
            'description' => null,
            'expires_at' => null,
        ]);
        $snippet->load('tags', 'user');

        $resource = SnippetResource::make($snippet)->resolve();

        $this->assertNull($resource['description']);
        $this->assertNull($resource['expires_at']);
        $this->assertSame([], $resource['tags']);
    }
}
