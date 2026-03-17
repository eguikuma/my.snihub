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
    public function GitHubのOAuth認可画面へリダイレクトされること(): void
    {
        $response = $this->getJson('/api/sessions/oauth/github');

        $response->assertRedirect();
        $this->assertStringContainsString('github.com', $response->headers->get('Location'));
    }

    #[Test]
    public function コールバックで新規ユーザーが作成されてフロントエンドへリダイレクトされること(): void
    {
        $this->mockSocialiteUser(id: '12345', name: 'testuser', email: 'test@example.com', avatar: 'https://example.com/avatar.png');

        $response = $this->getJson('/api/sessions/oauth/github/callback');

        $response->assertRedirect();
        $this->assertStringContainsString('?token=', $response->headers->get('Location'));
        $this->assertDatabaseHas('users', ['email' => 'test@example.com', 'name' => 'testuser']);
        $this->assertDatabaseHas('user_providers', ['type' => 'github', 'external_id' => '12345']);
    }

    #[Test]
    public function コールバックでプロバイダー登録済みの既存ユーザーがログインできること(): void
    {
        $user = User::factory()->create(['name' => 'oldname']);
        UserProvider::factory()->create([
            'user_id' => $user->id,
            'type' => 'github',
            'external_id' => '12345',
        ]);
        $this->mockSocialiteUser(id: '12345', name: 'newname', email: $user->email, avatar: 'https://example.com/new-avatar.png');

        $response = $this->getJson('/api/sessions/oauth/github/callback');

        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'newname']);
    }

    #[Test]
    public function コールバックで同一メールの既存ユーザーにプロバイダーが紐付くこと(): void
    {
        $user = User::factory()->create(['email' => 'shared@example.com']);
        $this->mockSocialiteUser(id: '99999', name: 'githubuser', email: 'shared@example.com', avatar: 'https://example.com/avatar.png');

        $response = $this->getJson('/api/sessions/oauth/github/callback');

        $response->assertRedirect();
        $this->assertDatabaseHas('user_providers', [
            'user_id' => $user->id,
            'type' => 'github',
            'external_id' => '99999',
        ]);
        $this->assertDatabaseCount('users', 1);
    }

    #[Test]
    public function コールバックでemailなしのGitHubユーザーが新規登録できること(): void
    {
        $this->mockSocialiteUser(id: '77777', name: 'noemail-user', email: null, avatar: 'https://example.com/avatar.png');

        $response = $this->getJson('/api/sessions/oauth/github/callback');

        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['name' => 'noemail-user', 'email' => null]);
    }

    #[Test]
    public function OAuthエンドポイントにレートリミットが適用されること(): void
    {
        for ($i = 0; $i < 11; $i++) {
            $response = $this->getJson('/api/sessions/oauth/github');
        }

        $response->assertStatus(Response::HTTP_TOO_MANY_REQUESTS);
    }

    private function mockSocialiteUser(
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

                public function stateless(): static
                {
                    return $this;
                }

                public function user(): SocialiteUser
                {
                    return $this->user;
                }
            });
    }
}
