<?php

namespace App\UseCases\Snippet\Dtos;

/**
 * スニペット検索の入力条件を表す
 */
class SnippetSearchDto
{
    public function __construct(
        public readonly ?string $keyword = null,
        public readonly ?string $tag = null,
        public readonly ?string $language = null,
        public readonly ?string $visibility = null,
        public readonly int $perPage = 20,
    ) {}
}
