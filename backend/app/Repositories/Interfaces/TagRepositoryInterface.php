<?php

namespace App\Repositories\Interfaces;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;

/**
 * タグのデータ操作の契約を定義する
 */
interface TagRepositoryInterface
{
    /**
     * 全タグを取得する
     *
     * @return Collection<int, Tag>
     */
    public function all(): Collection;

    /**
     * タグ名の配列で既存タグを検索する
     *
     * @param  string[]  $names
     * @return Collection<int, Tag>
     */
    public function find(array $names): Collection;

    /**
     * スニペット数の多い順にタグを取得する
     *
     * @return Collection<int, Tag>
     */
    public function popular(int $limit): Collection;

    /**
     * キーワードでタグを前方一致検索する
     *
     * @return Collection<int, Tag>
     */
    public function search(string $keyword, int $limit): Collection;

    /**
     * タグを新規作成する
     */
    public function create(string $name): Tag;
}
