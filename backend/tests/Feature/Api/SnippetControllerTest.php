<?php

namespace Tests\Feature\Api;

use App\Models\Snippet;
use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class SnippetControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function 未認証でも公開スニペット一覧を取得できること(): void
    {
        Snippet::factory()->count(3)->public()->create();

        $response = $this->getJson('/api/snippets');

        $response->assertOk();
        $response->assertJsonCount(3, 'data');
    }

    #[Test]
    public function キーワードで公開スニペットを検索できること(): void
    {
        Snippet::factory()->public()->create(['title' => 'React Hooks guide']);
        Snippet::factory()->public()->create(['title' => 'Laravel tutorial']);

        $response = $this->getJson('/api/snippets?keyword=hooks');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
    }

    #[Test]
    public function 未認証でもslugで公開スニペットを閲覧できること(): void
    {
        $snippet = Snippet::factory()->create([
            'title' => 'Public Snippet',
            'language' => 'php',
        ]);
        $snippet->tags()->attach(Tag::factory()->create(['name' => 'php']));

        $response = $this->getJson("/api/snippets/{$snippet->slug}");

        $response->assertOk();
        $response->assertJsonPath('data.title', 'Public Snippet');
        $response->assertJsonPath('data.tags', ['php']);
        $response->assertJsonMissingPath('data.id');
        $response->assertJsonMissingPath('data.user_id');
    }

    #[Test]
    public function 存在しないslugの場合、404を返すこと(): void
    {
        $response = $this->getJson('/api/snippets/nonexist');

        $response->assertStatus(Response::HTTP_NOT_FOUND);
    }

    #[Test]
    public function 期限切れの公開スニペットの場合、404を返すこと(): void
    {
        $snippet = Snippet::factory()->create([
            'expires_at' => now()->subHour(),
        ]);

        $response = $this->getJson("/api/snippets/{$snippet->slug}");

        $response->assertStatus(Response::HTTP_NOT_FOUND);
    }

    #[Test]
    public function 非公開スニペットはslugでアクセスしても404を返すこと(): void
    {
        $snippet = Snippet::factory()->private()->create();

        $response = $this->getJson("/api/snippets/{$snippet->slug}");

        $response->assertStatus(Response::HTTP_NOT_FOUND);
    }

    #[Test]
    public function 限定公開スニペットはslugで閲覧できること(): void
    {
        $snippet = Snippet::factory()->unlisted()->create();

        $response = $this->getJson("/api/snippets/{$snippet->slug}");

        $response->assertOk();
        $response->assertJsonPath('data.title', $snippet->title);
    }

    #[Test]
    public function 一覧レスポンスにcode_previewが含まれcodeが含まれないこと(): void
    {
        Snippet::factory()->public()->create([
            'code' => "line 1\nline 2\nline 3\nline 4\nline 5",
        ]);

        $response = $this->getJson('/api/snippets');

        $response->assertOk();
        $response->assertJsonPath('data.0.code_preview', "line 1\nline 2\nline 3");
        $response->assertJsonMissingPath('data.0.code');
    }

    #[Test]
    public function 詳細レスポンスにcodeが含まれcode_previewが含まれないこと(): void
    {
        $snippet = Snippet::factory()->public()->create([
            'code' => "line 1\nline 2\nline 3\nline 4\nline 5",
        ]);

        $response = $this->getJson("/api/snippets/{$snippet->slug}");

        $response->assertOk();
        $response->assertJsonPath('data.code', "line 1\nline 2\nline 3\nline 4\nline 5");
        $response->assertJsonMissingPath('data.code_preview');
    }

    #[Test]
    public function レスポンスにvisibilityが含まれること(): void
    {
        $snippet = Snippet::factory()->public()->create();

        $response = $this->getJson("/api/snippets/{$snippet->slug}");

        $response->assertOk();
        $response->assertJsonPath('data.visibility', 'public');
    }
}
