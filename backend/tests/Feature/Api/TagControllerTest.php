<?php

namespace Tests\Feature\Api;

use App\Models\Snippet;
use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TagControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function 未認証でもタグ一覧を取得できること(): void
    {
        $tag = Tag::factory()->create();
        Snippet::factory()->public()->create()->tags()->attach($tag);

        $response = $this->getJson('/api/tags');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
    }

    #[Test]
    public function タグが存在しない場合は空配列を返すこと(): void
    {
        $response = $this->getJson('/api/tags');

        $response->assertOk();
        $response->assertExactJson(['data' => []]);
    }

    #[Test]
    public function レスポンスがタグ名の文字列配列であること(): void
    {
        $tagPhp = Tag::factory()->create(['name' => 'php']);
        $tagReact = Tag::factory()->create(['name' => 'react']);
        Snippet::factory()->public()->create()->tags()->attach($tagPhp);
        Snippet::factory()->public()->create()->tags()->attach($tagReact);

        $response = $this->getJson('/api/tags');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
    }

    #[Test]
    public function スニペット数の多い順にソートされていること(): void
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

        $response = $this->getJson('/api/tags');

        $response->assertOk();
        $response->assertExactJson(['data' => ['php', 'react', 'css']]);
    }

    #[Test]
    public function キーワードで前方一致検索できること(): void
    {
        $tagReact = Tag::factory()->create(['name' => 'react']);
        $tagRedis = Tag::factory()->create(['name' => 'redis']);
        Tag::factory()->create(['name' => 'php']);
        Snippet::factory()->public()->create()->tags()->attach($tagReact);
        Snippet::factory()->public()->create()->tags()->attach($tagRedis);

        $response = $this->getJson('/api/tags?keyword=re');

        $response->assertOk();
        $response->assertExactJson(['data' => ['react', 'redis']]);
    }
}
