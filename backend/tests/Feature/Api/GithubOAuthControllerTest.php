<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\UserProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class GithubOAuthControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function 認可コードで新規ユーザーが作成されてトークンが返却されること(): void
    {
        $this->mockSocialiteDriver(id: '12345', name: 'testuser', email: 'test@example.com', avatar: 'https://example.com/avatar.png');

        $response = $this->postJson('/api/sessions/oauth/github', [
            'code' => 'valid-code',
        ]);

        $response->assertOk();
        $response->assertJsonStructure(['token']);
        $this->assertDatabaseHas('users', ['email' => 'test@example.com', 'name' => 'testuser']);
        $this->assertDatabaseHas('user_providers', ['type' => 'github', 'external_id' => '12345']);
    }

    #[Test]
    public function プロバイダー登録済みの既存ユーザーがトークンを取得できること(): void
    {
        $user = User::factory()->create(['name' => 'oldname']);
        UserProvider::factory()->create([
            'user_id' => $user->id,
            'type' => 'github',
            'external_id' => '12345',
        ]);
        $this->mockSocialiteDriver(id: '12345', name: 'newname', email: $user->email, avatar: 'https://example.com/new-avatar.png');

        $response = $this->postJson('/api/sessions/oauth/github', [
            'code' => 'valid-code',
        ]);

        $response->assertOk();
        $response->assertJsonStructure(['token']);
        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'newname']);
    }

    #[Test]
    public function 同一メールの既存ユーザーにプロバイダーが紐付くこと(): void
    {
        $user = User::factory()->create(['email' => 'shared@example.com']);
        $this->mockSocialiteDriver(id: '99999', name: 'githubuser', email: 'shared@example.com', avatar: 'https://example.com/avatar.png');

        $response = $this->postJson('/api/sessions/oauth/github', [
            'code' => 'valid-code',
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('user_providers', [
            'user_id' => $user->id,
            'type' => 'github',
            'external_id' => '99999',
        ]);
        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'email' => 'shared@example.com',
        ]);
    }

    #[Test]
    public function emailなしのGitHubユーザーが新規登録できること(): void
    {
        $this->mockSocialiteDriver(id: '77777', name: 'noemail-user', email: null, avatar: 'https://example.com/avatar.png');

        $response = $this->postJson('/api/sessions/oauth/github', [
            'code' => 'valid-code',
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('users', ['name' => 'noemail-user', 'email' => null]);
    }

    #[Test]
    public function 認可コードが未指定の場合、バリデーションエラーになること(): void
    {
        $response = $this->postJson('/api/sessions/oauth/github', []);

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
        $response->assertJsonValidationErrors(['code']);
    }

    #[Test]
    public function OAuthエンドポイントにレートリミットが適用されること(): void
    {
        $this->mockSocialiteDriver(id: '12345', name: 'testuser', email: 'test@example.com', avatar: 'https://example.com/avatar.png');

        for ($i = 0; $i < 11; $i++) {
            $response = $this->postJson('/api/sessions/oauth/github', [
                'code' => 'valid-code',
            ]);
        }

        $response->assertStatus(Response::HTTP_TOO_MANY_REQUESTS);
    }

    private function mockSocialiteDriver(
        string $id,
        string $name,
        ?string $email,
        string $avatar,
    ): void {
        $socialiteUser = new SocialiteUser;
        $socialiteUser->id = $id;
        $socialiteUser->name = $name;
        $socialiteUser->email = $email;
        $socialiteUser->avatar = $avatar;

        Socialite::shouldReceive('driver')
            ->with('github')
            ->andReturn(new class($socialiteUser)
            {
                public function __construct(private SocialiteUser $user) {}

                public function getAccessTokenResponse(): array
                {
                    return ['access_token' => 'mock-github-access-token'];
                }

                public function userFromToken(): SocialiteUser
                {
                    return $this->user;
                }
            });
    }
}
