<?php

namespace Tests\Feature\Api;

use App\Enums\Visibility;
use App\Models\Snippet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class MySnippetStatisticsControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function 未認証の場合は401を返すこと(): void
    {
        $response = $this->getJson('/api/me/snippets/statistics');

        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    #[Test]
    public function 認証済みユーザーの公開範囲別スニペット件数を返すこと(): void
    {
        $user = User::factory()->create();
        Snippet::factory()->count(3)->create(['user_id' => $user->id, 'visibility' => Visibility::Public]);
        Snippet::factory()->count(2)->create(['user_id' => $user->id, 'visibility' => Visibility::Unlisted]);
        Snippet::factory()->count(1)->create(['user_id' => $user->id, 'visibility' => Visibility::Private]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/me/snippets/statistics');

        $response->assertOk();
        $response->assertExactJson([
            'total' => 6,
            'public' => 3,
            'unlisted' => 2,
            'private' => 1,
        ]);
    }

    #[Test]
    public function 他ユーザーのスニペットは含まれないこと(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        Snippet::factory()->count(2)->create(['user_id' => $user->id, 'visibility' => Visibility::Public]);
        Snippet::factory()->count(5)->create(['user_id' => $other->id, 'visibility' => Visibility::Public]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/me/snippets/statistics');

        $response->assertOk();
        $response->assertJsonPath('total', 2);
        $response->assertJsonPath('public', 2);
    }

    #[Test]
    public function スニペットがない場合はすべて0を返すこと(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/me/snippets/statistics');

        $response->assertOk();
        $response->assertExactJson([
            'total' => 0,
            'public' => 0,
            'unlisted' => 0,
            'private' => 0,
        ]);
    }

    #[Test]
    public function 期限切れのスニペットも件数に含まれること(): void
    {
        $user = User::factory()->create();
        Snippet::factory()->create([
            'user_id' => $user->id,
            'visibility' => Visibility::Public,
            'expires_at' => now()->subDay(),
        ]);
        Snippet::factory()->create([
            'user_id' => $user->id,
            'visibility' => Visibility::Public,
            'expires_at' => null,
        ]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/me/snippets/statistics');

        $response->assertOk();
        $response->assertJsonPath('total', 2);
        $response->assertJsonPath('public', 2);
    }
}
