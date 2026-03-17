<?php

namespace App\Repositories\Eloquent;

use App\Models\Tag;
use App\Repositories\Interfaces\TagRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

/**
 * Eloquent を使用したタグのデータ操作を実装する
 */
class TagRepository implements TagRepositoryInterface
{
    public function all(): Collection
    {
        return Tag::orderBy('name')->get();
    }

    public function popular(int $limit): Collection
    {
        return Tag::withCount('snippets')
            ->orderByDesc('snippets_count')
            ->limit($limit)
            ->get();
    }

    public function search(string $keyword, int $limit): Collection
    {
        return Tag::where('name', 'ILIKE', $keyword.'%')
            ->orderBy('name')
            ->limit($limit)
            ->get();
    }

    public function find(array $names): Collection
    {
        return Tag::whereIn('name', $names)->get();
    }

    public function create(string $name): Tag
    {
        return Tag::create(['name' => $name]);
    }
}
