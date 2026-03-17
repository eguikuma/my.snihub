<?php

namespace Tests\Feature\Api;

use App\Models\Snippet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class MySnippetControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function 未認証の場合、作成は401を返すこと(): void
    {
        $response = $this->postJson('/api/me/snippets', [
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

        $response = $this->postJson('/api/me/snippets', [
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

        $response = $this->postJson('/api/me/snippets', [
            'title' => '',
            'code' => '',
            'language' => 'brainfuck',
        ]);

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
        $response->assertJsonValidationErrors(['title', 'code', 'language']);
    }

    #[Test]
    public function 認証済みユーザーは自分のスニペット一覧を取得できること(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        Snippet::factory()->count(3)->create(['user_id' => $user->id]);
        Snippet::factory()->count(2)->create(['user_id' => $other->id]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/me/snippets');

        $response->assertOk();
        $response->assertJsonCount(3, 'data');
    }

    #[Test]
    public function 作成者はスニペットを更新できること(): void
    {
        $user = User::factory()->create();
        $snippet = Snippet::factory()->create(['user_id' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->putJson("/api/me/snippets/{$snippet->slug}", [
            'title' => 'Updated Title',
            'code' => 'updated code',
            'language' => 'typescript',
            'visibility' => 'unlisted',
            'tags' => ['updated'],
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.title', 'Updated Title');
        $response->assertJsonPath('data.code', 'updated code');
        $response->assertJsonPath('data.language', 'typescript');
        $response->assertJsonPath('data.visibility', 'unlisted');
        $response->assertJsonPath('data.tags', ['updated']);
    }

    #[Test]
    public function 作成者以外はスニペットを更新できないこと(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $snippet = Snippet::factory()->create(['user_id' => $owner->id]);
        Sanctum::actingAs($other);

        $response = $this->putJson("/api/me/snippets/{$snippet->slug}", [
            'title' => 'Hacked',
            'code' => 'hacked code',
            'language' => 'php',
            'visibility' => 'unlisted',
        ]);

        $response->assertStatus(Response::HTTP_FORBIDDEN);
    }

    #[Test]
    public function 作成者はスニペットを削除できること(): void
    {
        $user = User::factory()->create();
        $snippet = Snippet::factory()->create(['user_id' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/me/snippets/{$snippet->slug}");

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

        $response = $this->deleteJson("/api/me/snippets/{$snippet->slug}");

        $response->assertStatus(Response::HTTP_FORBIDDEN);
        $this->assertDatabaseHas('snippets', ['id' => $snippet->id]);
    }

    #[Test]
    public function スニペット作成時にvisibilityを指定できること(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/me/snippets', [
            'title' => 'Public Snippet',
            'code' => 'echo "hello";',
            'language' => 'php',
            'visibility' => 'public',
        ]);

        $response->assertStatus(Response::HTTP_CREATED);
        $response->assertJsonPath('data.visibility', 'public');
        $this->assertDatabaseHas('snippets', [
            'user_id' => $user->id,
            'visibility' => 'public',
        ]);
    }

    #[Test]
    public function スニペット作成時にvisibility未指定の場合、デフォルトでunlistedになること(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/me/snippets', [
            'title' => 'Default Visibility',
            'code' => 'echo "hello";',
            'language' => 'php',
        ]);

        $response->assertStatus(Response::HTTP_CREATED);
        $response->assertJsonPath('data.visibility', 'unlisted');
    }

    #[Test]
    public function スニペット更新時にvisibilityを変更できること(): void
    {
        $user = User::factory()->create();
        $snippet = Snippet::factory()->create(['user_id' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->putJson("/api/me/snippets/{$snippet->slug}", [
            'title' => $snippet->title,
            'code' => $snippet->code,
            'language' => $snippet->language,
            'visibility' => 'public',
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.visibility', 'public');
        $this->assertDatabaseHas('snippets', [
            'id' => $snippet->id,
            'visibility' => 'public',
        ]);
    }
}
