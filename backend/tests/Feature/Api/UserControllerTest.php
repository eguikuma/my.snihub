<?php

namespace Tests\Feature\Api;

use App\Enums\ProviderType;
use App\Models\User;
use App\Models\UserProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function 認証ユーザー情報を取得できること(): void
    {
        $user = User::factory()->create(['name' => 'Test User', 'email' => 'test@example.com']);
        UserProvider::factory()->create([
            'user_id' => $user->id,
            'type' => ProviderType::Github,
            'external_id' => '12345',
        ]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/me');

        $response->assertOk();
        $response->assertJsonPath('data.name', 'Test User');
        $response->assertJsonPath('data.email', 'test@example.com');
        $response->assertJsonPath('data.providers', ['github']);
    }

    #[Test]
    public function レスポンスにidやpassword等の機密情報が含まれないこと(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/me');

        $response->assertOk();
        $response->assertJsonMissingPath('data.id');
        $response->assertJsonMissingPath('data.password');
    }

    #[Test]
    public function 未認証の場合は401を返すこと(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }
}
