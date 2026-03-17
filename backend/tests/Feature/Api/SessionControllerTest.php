<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class SessionControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function ログアウトでトークンが失効すること(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->deleteJson('/api/sessions/current');

        $response->assertStatus(Response::HTTP_NO_CONTENT);
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    #[Test]
    public function 未認証でログアウトすると401を返すこと(): void
    {
        $response = $this->deleteJson('/api/sessions/current');

        $response->assertStatus(Response::HTTP_UNAUTHORIZED);
    }
}
