<?php

namespace Tests\Unit\Models;

use App\Models\User;
use App\Models\UserProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserProviderTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function プロバイダーは、どのユーザーの認証情報かを辿れるよう、ユーザーへのリレーションを持つこと(): void
    {
        $user = User::factory()->create();

        $provider = UserProvider::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($provider->user->is($user));
    }

    #[Test]
    public function プロバイダー情報は、OAuth認証時に登録・更新するため、fillableであること(): void
    {
        $userProvider = UserProvider::factory()->create();

        $this->assertNotNull($userProvider->type);
        $this->assertNotNull($userProvider->external_id);
    }
}
