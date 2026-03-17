<?php

namespace App\Repositories\Dtos;

/**
 * スニペット更新のデータを表す
 */
class SnippetUpdateDto
{
    /**
     * @param  int[]  $tagIds
     */
    public function __construct(
        public readonly string $title,
        public readonly string $code,
        public readonly string $language,
        public readonly ?string $description = null,
        public readonly array $tagIds = [],
    ) {}
}
