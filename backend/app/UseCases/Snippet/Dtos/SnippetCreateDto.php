<?php

namespace App\UseCases\Snippet\Dtos;

use App\Enums\ExpiresIn;
use App\Enums\Visibility;

/**
 * スニペット作成の入力データを表す
 */
class SnippetCreateDto
{
    /**
     * @param  string[]  $tags
     */
    public function __construct(
        public readonly string $title,
        public readonly string $code,
        public readonly string $language,
        public readonly ?string $description = null,
        public readonly ?Visibility $visibility = null,
        public readonly ?ExpiresIn $expiresIn = null,
        public readonly array $tags = [],
    ) {}
}
