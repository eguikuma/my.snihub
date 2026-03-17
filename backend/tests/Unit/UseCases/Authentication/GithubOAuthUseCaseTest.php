<?php

namespace Tests\Unit\UseCases\Authentication;

use App\Enums\ProviderType;
use App\Models\User;
use App\Repositories\Dtos\UserUpdateDto;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\UseCases\Authentication\GithubOAuthUseCase;
use Laravel\Sanctum\NewAccessToken;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery;
use Mockery\MockInterface;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class GithubOAuthUseCaseTest extends TestCase
{
    private UserRepositoryInterface&MockInterface $userRepository;

    private GithubOAuthUseCase $useCase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->userRepository = Mockery::mock(UserRepositoryInterface::class);
        $this->useCase = new GithubOAuthUseCase($this->userRepository);
    }

    #[Test]
    public function GitHubプロバイダー登録済みのユーザーは、プロフィールが更新されてトークンが発行されること(): void
    {
        $socialiteUser = $this->makeSocialiteUser(id: '12345', name: 'octocat', email: 'octocat@github.com', avatar: 'https://github.com/avatar.png');
        $user = Mockery::mock(User::class);
        $this->userRepository->shouldReceive('findByOAuth')
            ->once()
            ->with(ProviderType::Github, '12345')
            ->andReturn($user);
        $capturedDto = null;
        $this->userRepository->shouldReceive('update')
            ->once()
            ->with($user, Mockery::capture($capturedDto))
            ->andReturn($user);
        $this->mockAccessToken(user: $user, plainTextToken: 'test-token');

        $result = $this->useCase->execute($socialiteUser);

        $this->assertSame($user, $result['user']);
        $this->assertSame('test-token', $result['token']);
        $this->assertSame('octocat', $capturedDto?->name);
        $this->assertSame('https://github.com/avatar.png', $capturedDto?->avatarUrl);
    }

    #[Test]
    public function プロバイダー未登録でも、同一メールのユーザーが存在すればプロバイダーが紐付くこと(): void
    {
        $socialiteUser = $this->makeSocialiteUser(id: '12345', name: 'octocat', email: 'octocat@github.com', avatar: 'https://github.com/avatar.png');
        $user = Mockery::mock(User::class);
        $this->userRepository->shouldReceive('findByOAuth')
            ->once()
            ->with(ProviderType::Github, '12345')
            ->andReturnNull();
        $this->userRepository->shouldReceive('findByCredentials')
            ->once()
            ->with('octocat@github.com')
            ->andReturn($user);
        $this->userRepository->shouldReceive('attach')
            ->once()
            ->with($user, ProviderType::Github, '12345');
        $this->userRepository->shouldReceive('update')
            ->once()
            ->with($user, Mockery::type(UserUpdateDto::class))
            ->andReturn($user);
        $this->mockAccessToken(user: $user, plainTextToken: 'test-token');

        $result = $this->useCase->execute($socialiteUser);

        $this->assertSame($user, $result['user']);
        $this->assertSame('test-token', $result['token']);
    }

    #[Test]
    public function プロバイダーもメールアドレスも一致しない場合、新規ユーザーが作成されてプロバイダーが紐付くこと(): void
    {
        $socialiteUser = $this->makeSocialiteUser(id: '12345', name: 'octocat', email: 'octocat@github.com', avatar: 'https://github.com/avatar.png');
        $user = Mockery::mock(User::class);
        $this->userRepository->shouldReceive('findByOAuth')
            ->once()
            ->andReturnNull();
        $this->userRepository->shouldReceive('findByCredentials')
            ->once()
            ->with('octocat@github.com')
            ->andReturnNull();
        $capturedDto = null;
        $this->userRepository->shouldReceive('create')
            ->once()
            ->with(Mockery::capture($capturedDto))
            ->andReturn($user);
        $this->userRepository->shouldReceive('attach')
            ->once()
            ->with($user, ProviderType::Github, '12345');
        $this->mockAccessToken(user: $user, plainTextToken: 'test-token');

        $result = $this->useCase->execute($socialiteUser);

        $this->assertSame($user, $result['user']);
        $this->assertSame('test-token', $result['token']);
        $this->assertSame('octocat', $capturedDto?->name);
        $this->assertSame('octocat@github.com', $capturedDto?->email);
        $this->assertSame('https://github.com/avatar.png', $capturedDto?->avatarUrl);
    }

    #[Test]
    public function GitHubでメールアドレスが非公開の場合、emailがnullのユーザーが作成されること(): void
    {
        $socialiteUser = $this->makeSocialiteUser(id: '12345', name: 'octocat', email: null, avatar: 'https://github.com/avatar.png');
        $user = Mockery::mock(User::class);
        $this->userRepository->shouldReceive('findByOAuth')
            ->once()
            ->andReturnNull();
        $capturedDto = null;
        $this->userRepository->shouldReceive('create')
            ->once()
            ->with(Mockery::capture($capturedDto))
            ->andReturn($user);
        $this->userRepository->shouldReceive('attach')
            ->once()
            ->with($user, ProviderType::Github, '12345');
        $this->mockAccessToken(user: $user, plainTextToken: 'test-token');

        $result = $this->useCase->execute($socialiteUser);

        $this->assertSame($user, $result['user']);
        $this->assertNull($capturedDto?->email);
    }

    #[Test]
    public function GitHubでメールアドレスが非公開の場合、メールアドレスでの突合がスキップされること(): void
    {
        $socialiteUser = $this->makeSocialiteUser(id: '12345', name: 'octocat', email: null, avatar: 'https://github.com/avatar.png');
        $user = Mockery::mock(User::class);
        $this->userRepository->shouldReceive('findByOAuth')
            ->once()
            ->andReturnNull();
        $this->userRepository->shouldNotReceive('findByCredentials');
        $this->userRepository->shouldReceive('create')
            ->once()
            ->andReturn($user);
        $this->userRepository->shouldReceive('attach')
            ->once();
        $this->mockAccessToken(user: $user, plainTextToken: 'test-token');

        $this->useCase->execute($socialiteUser);
    }

    private function makeSocialiteUser(string $id, string $name, ?string $email, string $avatar): SocialiteUser
    {
        $socialiteUser = new SocialiteUser;
        $socialiteUser->id = $id;
        $socialiteUser->name = $name;
        $socialiteUser->email = $email;
        $socialiteUser->avatar = $avatar;

        return $socialiteUser;
    }

    private function mockAccessToken(User&MockInterface $user, string $plainTextToken): void
    {
        $accessToken = Mockery::mock(NewAccessToken::class);
        $accessToken->plainTextToken = $plainTextToken;
        $user->shouldReceive('createToken')
            ->once()
            ->with('github')
            ->andReturn($accessToken);
    }
}
