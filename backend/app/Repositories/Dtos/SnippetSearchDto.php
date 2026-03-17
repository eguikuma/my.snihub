<?php

namespace App\Repositories\Dtos;

/**
 * スニペット検索の条件を表す
 */
class SnippetSearchDto
{
    public function __construct(
        public readonly ?string $keyword = null,
        public readonly ?string $tag = null,
        public readonly ?string $language = null,
        public readonly ?int $userId = null,
        public readonly bool $withExpired = false,
    ) {}
}
