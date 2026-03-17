<?php

namespace Tests\Unit\Models;

use App\Models\Snippet;
use App\Models\User;
use App\Models\UserProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function ユーザーは、自分のスニペットを管理するため、スニペットへのリレーションを持つこと(): void
    {
        $user = User::factory()->create();

        Snippet::factory()->count(3)->create(['user_id' => $user->id]);

        $this->assertCount(3, $user->snippets);
        $this->assertInstanceOf(Snippet::class, $user->snippets->first());
    }

    #[Test]
    public function ユーザーは、複数のOAuthプロバイダーで認証できるよう、プロバイダーへのリレーションを持つこと(): void
    {
        $user = User::factory()->create();

        UserProvider::factory()->count(2)->create(['user_id' => $user->id]);

        $this->assertCount(2, $user->userProviders);
        $this->assertInstanceOf(UserProvider::class, $user->userProviders->first());
    }

    #[Test]
    public function avatar_urlは、OAuthプロフィールから取得・更新するため、fillableであること(): void
    {
        $user = User::factory()->create([
            'avatar_url' => 'https://example.com/avatar.png',
        ]);

        $this->assertSame('https://example.com/avatar.png', $user->avatar_url);
    }
}
