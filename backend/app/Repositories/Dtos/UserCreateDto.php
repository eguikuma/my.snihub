<?php

namespace App\Repositories\Dtos;

/**
 * ユーザー作成のデータを表す
 */
class UserCreateDto
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $email,
        public readonly ?string $avatarUrl,
    ) {}
}
