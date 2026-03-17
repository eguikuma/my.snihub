<?php

namespace App\UseCases\Authentication;

use App\Enums\ProviderType;
use App\Models\User;
use App\Repositories\Dtos\UserCreateDto;
use App\Repositories\Dtos\UserUpdateDto;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Laravel\Socialite\Two\User as SocialiteUser;

/**
 * GitHub OAuthコールバックを処理し、ユーザーの認証とトークン発行を行う
 */
class GithubOAuthUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    /**
     * @return array{user: User, token: string}
     */
    public function execute(SocialiteUser $socialiteUser): array
    {
        $user = $this->userRepository->findByOAuth(ProviderType::Github, $socialiteUser->getId());

        if ($user) {
            $this->updateByProvider($user, $socialiteUser);
        } else {
            $user = $this->findOrCreate($socialiteUser);
        }

        $token = $user->createToken('github')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    /**
     * プロバイダー側のユーザーをもとに既存ユーザーを検索し、見つからなければ新規作成する
     */
    private function findOrCreate(SocialiteUser $socialiteUser): User
    {
        $email = $socialiteUser->getEmail();

        /***
         * メールアドレスが既存ユーザーと一致する場合、プロバイダーを紐付ける
         */
        if ($email !== null) {
            $user = $this->userRepository->findByCredentials($email);

            if ($user) {
                $this->userRepository->attach($user, ProviderType::Github, $socialiteUser->getId());
                $this->updateByProvider($user, $socialiteUser);

                return $user;
            }
        }

        /***
         * メールアドレスがない場合、新規ユーザーを作成する
         */
        $user = $this->userRepository->create(new UserCreateDto(
            name: $socialiteUser->getName(),
            email: $email,
            avatarUrl: $socialiteUser->getAvatar(),
        ));

        $this->userRepository->attach($user, ProviderType::Github, $socialiteUser->getId());

        return $user;
    }

    /**
     * プロバイダー側のユーザーで更新する
     */
    private function updateByProvider(User $user, SocialiteUser $socialiteUser): void
    {
        $this->userRepository->update($user, new UserUpdateDto(
            name: $socialiteUser->getName(),
            avatarUrl: $socialiteUser->getAvatar(),
        ));
    }
}
