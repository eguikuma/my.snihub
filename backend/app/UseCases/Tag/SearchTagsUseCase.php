<?php

namespace App\UseCases\Tag;

use App\Repositories\Interfaces\TagRepositoryInterface;
use Illuminate\Support\Collection;

/**
 * タグ一覧を取得する
 *
 * キーワード指定時は前方一致検索、未指定時は人気順で返す
 */
class SearchTagsUseCase
{
    private const POPULAR_LIMIT = 10;

    private const SEARCH_LIMIT = 20;

    public function __construct(
        private TagRepositoryInterface $tagRepository,
    ) {}

    public function execute(?string $keyword = null): Collection
    {
        if ($keyword !== null && $keyword !== '') {
            return $this->tagRepository
                ->search($keyword, self::SEARCH_LIMIT)
                ->pluck('name');
        }

        return $this->tagRepository
            ->popular(self::POPULAR_LIMIT)
            ->pluck('name');
    }
}
