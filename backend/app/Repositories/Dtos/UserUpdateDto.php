<?php

namespace App\Repositories\Dtos;

/**
 * ユーザー更新のデータを表す
 */
class UserUpdateDto
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $avatarUrl,
    ) {}
}
