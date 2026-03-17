<?php

namespace App\UseCases\Snippet\Dtos;

/**
 * スニペット更新の入力データを表す
 */
class SnippetUpdateDto
{
    /**
     * @param  string[]  $tags
     */
    public function __construct(
        public readonly string $title,
        public readonly string $code,
        public readonly string $language,
        public readonly ?string $description = null,
        public readonly array $tags = [],
    ) {}
}
