<?php

namespace Tests\Feature\Api;

use App\Models\Snippet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class CronControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function 正しいシークレットで期限切れスニペットが削除されること(): void
    {
        config()->set('app.cron_secret', 'test-secret');
        $user = User::factory()->create();
        $expired = Snippet::factory()->create([
            'user_id' => $user->id,
            'expires_at' => now()->subDay(),
        ]);
        $active = Snippet::factory()->create([
            'user_id' => $user->id,
            'expires_at' => now()->addDay(),
        ]);

        $response = $this->postJson('/api/cron/prune', [], [
            'Authorization' => 'Bearer test-secret',
        ]);

        $response->assertStatus(Response::HTTP_NO_CONTENT);
        $this->assertDatabaseMissing('snippets', ['id' => $expired->id]);
        $this->assertDatabaseHas('snippets', ['id' => $active->id]);
    }

    #[Test]
    public function シークレットが不一致の場合、401を返すこと(): void
    {
        config()->set('app.cron_secret', 'correct-secret');

        $response = $this->postJson('/api/cron/prune', [], [
            'Authorization' => 'Bearer wrong-secret',
        ]);

        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    #[Test]
    public function Bearerトークンなしの場合、401を返すこと(): void
    {
        config()->set('app.cron_secret', 'test-secret');

        $response = $this->postJson('/api/cron/prune');

        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    #[Test]
    public function CRON_SECRET未設定の場合、401を返すこと(): void
    {
        config()->set('app.cron_secret', null);

        $response = $this->postJson('/api/cron/prune', [], [
            'Authorization' => 'Bearer any-value',
        ]);

        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }
}
