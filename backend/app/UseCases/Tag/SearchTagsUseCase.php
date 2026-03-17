<?php

namespace App\UseCases\Tag;

use App\Repositories\Interfaces\TagRepositoryInterface;
use Illuminate\Support\Collection;

/**
 * タグ一覧を取得する
 */
class SearchTagsUseCase
{
    public function __construct(
        private TagRepositoryInterface $tagRepository,
    ) {}

    public function execute(): Collection
    {
        return $this->tagRepository->all()->pluck('name');
    }
}
