<?php

namespace Tests\Unit\Http\Resources;

use App\Http\Resources\SnippetSummaryResource;
use App\Models\Snippet;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SnippetSummaryResourceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function スニペット一覧用のJSON構造にcode_previewが含まれること(): void
    {
        $user = User::factory()->create(['name' => 'テストユーザー']);
        $code = implode("\n", [
            'line 1',
            'line 2',
            'line 3',
            'line 4',
            'line 5',
            'line 6',
            'line 7',
            'line 8',
            'line 9',
            'line 10',
        ]);
        $snippet = Snippet::factory()->create([
            'user_id' => $user->id,
            'title' => 'Hello World',
            'code' => $code,
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

        $resource = SnippetSummaryResource::make($snippet)->resolve();

        $this->assertSame($snippet->slug, $resource['slug']);
        $this->assertSame('Hello World', $resource['title']);
        $this->assertSame("line 1\nline 2\nline 3", $resource['code_preview']);
        $this->assertArrayNotHasKey('code', $resource);
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
    public function コードが最大行数以下の場合そのまま返ること(): void
    {
        $snippet = Snippet::factory()->create([
            'code' => "line 1\nline 2",
        ]);
        $snippet->load('tags', 'user');

        $resource = SnippetSummaryResource::make($snippet)->resolve();

        $this->assertSame("line 1\nline 2", $resource['code_preview']);
    }

    #[Test]
    public function 任意項目がnullの場合も一覧用JSON構造が正しいこと(): void
    {
        $snippet = Snippet::factory()->create([
            'description' => null,
            'expires_at' => null,
        ]);
        $snippet->load('tags', 'user');

        $resource = SnippetSummaryResource::make($snippet)->resolve();

        $this->assertNull($resource['description']);
        $this->assertNull($resource['expires_at']);
        $this->assertSame([], $resource['tags']);
        $this->assertArrayNotHasKey('code', $resource);
    }
}
