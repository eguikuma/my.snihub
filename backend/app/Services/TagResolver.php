<?php

namespace App\Services;

use App\Repositories\Interfaces\TagRepositoryInterface;

/**
 * タグ名の正規化・既存タグの検索・不足分の作成を行い、タグIDの配列を返す
 */
class TagResolver
{
    public function __construct(
        private TagRepositoryInterface $tagRepository,
    ) {}

    /**
     * @param  string[]  $names
     * @return int[]
     */
    public function resolve(array $names): array
    {
        if (empty($names)) {
            return [];
        }

        $normalized = array_map('strtolower', $names);
        $existing = $this->tagRepository->find($normalized);
        $existingNames = $existing->pluck('name')->all();

        $newTags = collect(array_diff($normalized, $existingNames))
            ->map(fn (string $name) => $this->tagRepository->create($name));

        return $existing->merge($newTags)->pluck('id')->all();
    }
}
