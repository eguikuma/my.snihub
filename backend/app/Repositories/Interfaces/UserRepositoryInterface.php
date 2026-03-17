<?php

namespace App\Repositories\Interfaces;

use App\Enums\ProviderType;
use App\Models\User;
use App\Repositories\Dtos\UserCreateDto;
use App\Repositories\Dtos\UserUpdateDto;

/**
 * ユーザーを起点としたデータ操作の契約を定義する
 */
interface UserRepositoryInterface
{
    /**
     * ユーザーに関連するリレーションをロードする
     */
    public function load(User $user): User;

    /**
     * OAuthプロバイダーの種別と外部IDからユーザーを取得する
     */
    public function findByOAuth(ProviderType $type, string $externalId): ?User;

    /**
     * メールアドレスからユーザーを取得する
     */
    public function findByCredentials(string $email): ?User;

    /**
     * ユーザーを新規作成する
     */
    public function create(UserCreateDto $dto): User;

    /**
     * ユーザー情報を更新する
     */
    public function update(User $user, UserUpdateDto $dto): User;

    /**
     * ユーザーにOAuth認証プロバイダーを紐付ける
     */
    public function attach(User $user, ProviderType $type, string $externalId): void;
}
