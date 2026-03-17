<?php

namespace App\Repositories\Dtos;

use App\Enums\Visibility;

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
        public readonly Visibility $visibility = Visibility::Unlisted,
        public readonly array $tagIds = [],
    ) {}
}
