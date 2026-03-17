<?php

namespace Tests\Feature\Api;

use App\Models\Snippet;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class SnippetApiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function 未認証の場合、一覧取得は401を返すこと(): void
    {
        $response = $this->getJson('/api/snippets');

        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    #[Test]
    public function 認証済みユーザーは自分のスニペット一覧を取得できること(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        Snippet::factory()->count(3)->create(['user_id' => $user->id]);
        Snippet::factory()->count(2)->create(['user_id' => $other->id]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/snippets');

        $response->assertOk();
        $response->assertJsonCount(3, 'data');
    }

    #[Test]
    public function キーワードでスニペットを検索できること(): void
    {
        $user = User::factory()->create();
        Snippet::factory()->create(['user_id' => $user->id, 'title' => 'React Hooks guide']);
        Snippet::factory()->create(['user_id' => $user->id, 'title' => 'Laravel tutorial']);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/snippets?keyword=hooks');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
    }

    #[Test]
    public function 未認証の場合、作成は401を返すこと(): void
    {
        $response = $this->postJson('/api/snippets', [
            'title' => 'Test',
            'code' => 'echo "hello";',
            'language' => 'php',
        ]);

        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    #[Test]
    public function 認証済みユーザーはスニペットを作成できること(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/snippets', [
            'title' => 'Hello World',
            'code' => 'echo "Hello, World!";',
            'language' => 'php',
            'description' => 'サンプルコード',
            'expires_in' => '1d',
            'tags' => ['php', 'sample'],
        ]);

        $response->assertStatus(Response::HTTP_CREATED);
        $response->assertJsonPath('data.title', 'Hello World');
        $response->assertJsonPath('data.language', 'php');
        $response->assertJsonPath('data.tags', ['php', 'sample']);
        $this->assertDatabaseHas('snippets', [
            'user_id' => $user->id,
            'title' => 'Hello World',
        ]);
    }

    #[Test]
    public function バリデーションエラーの場合、422を返すこと(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/snippets', [
            'title' => '',
            'code' => '',
            'language' => 'brainfuck',
        ]);

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
        $response->assertJsonValidationErrors(['title', 'code', 'language']);
    }

    #[Test]
    public function 未認証でもslugでスニペットを閲覧できること(): void
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
    public function 期限切れスニペットの場合、404を返すこと(): void
    {
        $snippet = Snippet::factory()->create([
            'expires_at' => now()->subHour(),
        ]);

        $response = $this->getJson("/api/snippets/{$snippet->slug}");

        $response->assertStatus(Response::HTTP_NOT_FOUND);
    }

    #[Test]
    public function 作成者はスニペットを更新できること(): void
    {
        $user = User::factory()->create();
        $snippet = Snippet::factory()->create(['user_id' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->putJson("/api/snippets/{$snippet->slug}", [
            'title' => 'Updated Title',
            'code' => 'updated code',
            'language' => 'typescript',
            'tags' => ['updated'],
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.title', 'Updated Title');
        $response->assertJsonPath('data.language', 'typescript');
        $response->assertJsonPath('data.tags', ['updated']);
    }

    #[Test]
    public function 作成者以外はスニペットを更新できないこと(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $snippet = Snippet::factory()->create(['user_id' => $owner->id]);
        Sanctum::actingAs($other);

        $response = $this->putJson("/api/snippets/{$snippet->slug}", [
            'title' => 'Hacked',
            'code' => 'hacked code',
            'language' => 'php',
        ]);

        $response->assertStatus(Response::HTTP_FORBIDDEN);
    }

    #[Test]
    public function 作成者はスニペットを削除できること(): void
    {
        $user = User::factory()->create();
        $snippet = Snippet::factory()->create(['user_id' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/snippets/{$snippet->slug}");

        $response->assertStatus(Response::HTTP_NO_CONTENT);
        $this->assertDatabaseMissing('snippets', ['id' => $snippet->id]);
    }

    #[Test]
    public function 作成者以外はスニペットを削除できないこと(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $snippet = Snippet::factory()->create(['user_id' => $owner->id]);
        Sanctum::actingAs($other);

        $response = $this->deleteJson("/api/snippets/{$snippet->slug}");

        $response->assertStatus(Response::HTTP_FORBIDDEN);
        $this->assertDatabaseHas('snippets', ['id' => $snippet->id]);
    }
}
