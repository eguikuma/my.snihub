<?php

namespace App\Repositories\Eloquent;

use App\Enums\ProviderType;
use App\Models\User;
use App\Repositories\Dtos\UserCreateDto;
use App\Repositories\Dtos\UserUpdateDto;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

/**
 * Eloquent を使用したユーザーのデータ操作を実装する
 */
class UserRepository implements UserRepositoryInterface
{
    public function load(User $user): User
    {
        return $user->load('userProviders');
    }

    public function findByOAuth(ProviderType $type, string $externalId): ?User
    {
        return User::whereHas('userProviders', fn (Builder $builder) => $builder
            ->where('type', $type)
            ->where('external_id', $externalId)
        )->first();
    }

    public function findByCredentials(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function create(UserCreateDto $dto): User
    {
        return User::create([
            'name' => $dto->name,
            'email' => $dto->email,
            'avatar_url' => $dto->avatarUrl,
        ]);
    }

    public function update(User $user, UserUpdateDto $dto): User
    {
        $user->update([
            'name' => $dto->name,
            'avatar_url' => $dto->avatarUrl,
        ]);

        return $user;
    }

    public function attach(User $user, ProviderType $type, string $externalId): void
    {
        $user->userProviders()->create([
            'type' => $type,
            'external_id' => $externalId,
        ]);
    }
}
