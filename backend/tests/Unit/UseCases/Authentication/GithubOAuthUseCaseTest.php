<?php

namespace Tests\Unit\UseCases\Authentication;

use App\Enums\ProviderType;
use App\Models\User;
use App\Repositories\Dtos\UserUpdateDto;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\UseCases\Authentication\GithubOAuthUseCase;
use Laravel\Sanctum\NewAccessToken;
use Laravel\Socialite\Facades\Socialite;
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
        $this->mockSocialiteDriver(id: '12345', name: 'octocat', email: 'octocat@github.com', avatar: 'https://github.com/avatar.png');
        $user = Mockery::mock(User::class);
        $this->userRepository->shouldReceive('findByOAuth')
            ->once()
            ->with(ProviderType::Github, '12345') /** 既存ユーザーあり */
            ->andReturn($user);
        $capturedDto = null;
        $this->userRepository->shouldReceive('update')
            ->once()
            ->with($user, Mockery::capture($capturedDto))
            ->andReturn($user); /** 更新 */
        $this->mockAccessToken(user: $user, plainTextToken: 'test-token');

        $result = $this->useCase->execute('valid-code');

        $this->assertSame($user, $result['user']);
        $this->assertSame('test-token', $result['token']);
        $this->assertSame('octocat', $capturedDto?->name);
        $this->assertSame('https://github.com/avatar.png', $capturedDto?->avatarUrl);
    }

    #[Test]
    public function プロバイダー未登録でも、同一メールのユーザーが存在すればプロバイダーが紐付くこと(): void
    {
        $this->mockSocialiteDriver(id: '12345', name: 'octocat', email: 'octocat@github.com', avatar: 'https://github.com/avatar.png');
        $user = Mockery::mock(User::class);
        $this->userRepository->shouldReceive('findByOAuth')
            ->once()
            ->with(ProviderType::Github, '12345')
            ->andReturnNull(); /** 既存ユーザーなし */
        $this->userRepository->shouldReceive('findByCredentials')
            ->once()
            ->with('octocat@github.com')
            ->andReturn($user); /** 既存ユーザーあり */
        $this->userRepository->shouldReceive('attach')
            ->once()
            ->with($user, ProviderType::Github, '12345'); /** 紐付け */
        $this->userRepository->shouldReceive('update')
            ->once()
            ->with($user, Mockery::type(UserUpdateDto::class))
            ->andReturn($user); /** 更新 */
        $this->mockAccessToken(user: $user, plainTextToken: 'test-token');

        $result = $this->useCase->execute('valid-code');

        $this->assertSame($user, $result['user']);
        $this->assertSame('test-token', $result['token']);
    }

    #[Test]
    public function プロバイダーもメールアドレスも一致しない場合、新規ユーザーが作成されてプロバイダーが紐付くこと(): void
    {
        $this->mockSocialiteDriver(id: '12345', name: 'octocat', email: 'octocat@github.com', avatar: 'https://github.com/avatar.png');
        $user = Mockery::mock(User::class);
        $this->userRepository->shouldReceive('findByOAuth')
            ->once()
            ->andReturnNull(); /** 既存ユーザーなし */
        $this->userRepository->shouldReceive('findByCredentials')
            ->once()
            ->with('octocat@github.com')
            ->andReturnNull(); /** 既存ユーザーなし */
        $capturedDto = null;
        $this->userRepository->shouldReceive('create')
            ->once()
            ->with(Mockery::capture($capturedDto))
            ->andReturn($user); /** 作成 */
        $this->userRepository->shouldReceive('attach')
            ->once()
            ->with($user, ProviderType::Github, '12345'); /** 紐付け */
        $this->mockAccessToken(user: $user, plainTextToken: 'test-token');

        $result = $this->useCase->execute('valid-code');

        $this->assertSame($user, $result['user']);
        $this->assertSame('test-token', $result['token']);
        $this->assertSame('octocat', $capturedDto?->name);
        $this->assertSame('octocat@github.com', $capturedDto?->email);
        $this->assertSame('https://github.com/avatar.png', $capturedDto?->avatarUrl);
    }

    #[Test]
    public function GitHubでメールアドレスが非公開の場合、メールアドレスでの突合をスキップして新規ユーザーが作成されること(): void
    {
        $this->mockSocialiteDriver(
            id: '12345',
            name: 'octocat',
            email: null, /** 非公開 */
            avatar: 'https://github.com/avatar.png'
        );
        $user = Mockery::mock(User::class);
        $this->userRepository->shouldReceive('findByOAuth')
            ->once()
            ->andReturnNull(); /** 既存ユーザーなし */
        $capturedDto = null;
        $this->userRepository->shouldNotReceive('findByCredentials'); /** 非公開なので、突合しようがない */
        $this->userRepository->shouldReceive('create')
            ->once()
            ->with(Mockery::capture($capturedDto))
            ->andReturn($user); /** 作成 */
        $this->userRepository->shouldReceive('attach')
            ->once()
            ->with($user, ProviderType::Github, '12345'); /** 紐付け */
        $this->mockAccessToken(user: $user, plainTextToken: 'test-token');

        $result = $this->useCase->execute('valid-code');

        $this->assertSame($user, $result['user']);
        $this->assertNull($capturedDto?->email);
    }

    private function mockSocialiteDriver(string $id, string $name, ?string $email, string $avatar): void
    {
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
