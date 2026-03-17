<?php

namespace Tests\Unit\Repositories;

use App\Enums\ProviderType;
use App\Models\User;
use App\Repositories\Dtos\UserCreateDto;
use App\Repositories\Dtos\UserUpdateDto;
use App\Repositories\Eloquent\UserRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserRepositoryTest extends TestCase
{
    use RefreshDatabase;

    private UserRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->repository = new UserRepository;
    }

    #[Test]
    public function loadで、リレーションがロードされること(): void
    {
        $user = User::factory()->create();

        $result = $this->repository->load($user);

        $this->assertSame($user, $result);
        $this->assertTrue($result->relationLoaded('userProviders'));
    }

    #[Test]
    public function findByOAuthで、プロバイダー種別と外部IDからユーザーを検索できること(): void
    {
        $user = User::factory()->hasUserProviders(1, [
            'type' => ProviderType::Github,
            'external_id' => '12345',
        ])->create();

        $result = $this->repository->findByOAuth(ProviderType::Github, '12345');

        $this->assertNotNull($result);
        $this->assertTrue($user->is($result));
    }

    #[Test]
    public function findByOAuthで、存在しないプロバイダーはnullを返すこと(): void
    {
        $result = $this->repository->findByOAuth(ProviderType::Github, 'nonexistent');

        $this->assertNull($result);
    }

    #[Test]
    public function findByCredentialsで、メールアドレスからユーザーを検索できること(): void
    {
        $user = User::factory()->create(['email' => 'test@example.com']);

        $result = $this->repository->findByCredentials('test@example.com');

        $this->assertNotNull($result);
        $this->assertTrue($user->is($result));
    }

    #[Test]
    public function findByCredentialsで、存在しないメールアドレスはnullを返すこと(): void
    {
        $result = $this->repository->findByCredentials('nonexistent@example.com');

        $this->assertNull($result);
    }

    #[Test]
    public function createで、ユーザーを作成できること(): void
    {
        $result = $this->repository->create(new UserCreateDto(
            name: 'テストユーザー',
            email: 'test@example.com',
            avatarUrl: 'https://example.com/avatar.png',
        ));

        $this->assertInstanceOf(User::class, $result);
        $this->assertDatabaseHas('users', [
            'id' => $result->id,
            'name' => 'テストユーザー',
            'email' => 'test@example.com',
            'avatar_url' => 'https://example.com/avatar.png',
        ]);
    }

    #[Test]
    public function createで、emailがnullのユーザーを作成できること(): void
    {
        $result = $this->repository->create(new UserCreateDto(
            name: 'テストユーザー',
            email: null,
            avatarUrl: 'https://example.com/avatar.png',
        ));

        $this->assertInstanceOf(User::class, $result);
        $this->assertDatabaseHas('users', [
            'id' => $result->id,
            'name' => 'テストユーザー',
            'email' => null,
        ]);
    }

    #[Test]
    public function updateで、ユーザー情報を更新できること(): void
    {
        $user = User::factory()->create([
            'name' => '変更前',
            'avatar_url' => 'https://example.com/old.png',
        ]);

        $result = $this->repository->update($user, new UserUpdateDto(
            name: '変更後',
            avatarUrl: 'https://example.com/new.png',
        ));

        $this->assertTrue($user->is($result));
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => '変更後',
            'avatar_url' => 'https://example.com/new.png',
        ]);
    }

    #[Test]
    public function attachで、ユーザーにプロバイダーを紐付けられること(): void
    {
        $user = User::factory()->create();

        $this->repository->attach($user, ProviderType::Github, '12345');

        $this->assertDatabaseHas('user_providers', [
            'user_id' => $user->id,
            'type' => ProviderType::Github->value,
            'external_id' => '12345',
        ]);
    }
}
