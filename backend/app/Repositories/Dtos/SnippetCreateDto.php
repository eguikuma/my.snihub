<?php

namespace App\Repositories\Dtos;

use Illuminate\Support\Carbon;

/**
 * スニペット作成のデータを表す
 */
class SnippetCreateDto
{
    /**
     * @param  int[]  $tagIds
     */
    public function __construct(
        public readonly int $userId,
        public readonly string $title,
        public readonly string $code,
        public readonly string $language,
        public readonly ?string $description = null,
        public readonly ?Carbon $expiresAt = null,
        public readonly array $tagIds = [],
    ) {}
}
