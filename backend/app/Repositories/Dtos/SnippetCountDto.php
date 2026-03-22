<?php

namespace App\Repositories\Dtos;

use App\Enums\Visibility;
use App\Repositories\Enums\SnippetGroupBy;

/**
 * スニペット集計の条件を表す
 */
class SnippetCountDto
{
    public function __construct(
        public readonly ?int $userId = null,
        public readonly ?Visibility $visibility = null,
        public readonly ?string $language = null,
        public readonly ?string $tag = null,
        public readonly ?string $keyword = null,
        public readonly bool $withExpired = true,
        public readonly ?SnippetGroupBy $groupBy = null,
    ) {}
}
