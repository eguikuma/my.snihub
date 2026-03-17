<?php

namespace App\Repositories\Interfaces;

use App\Models\Snippet;
use App\Repositories\Dtos\SnippetCreateDto;
use App\Repositories\Dtos\SnippetSearchDto;
use App\Repositories\Dtos\SnippetUpdateDto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * スニペットを起点としたデータ操作の契約を定義する
 */
interface SnippetRepositoryInterface
{
    /**
     * slug でスニペットを検索する
     */
    public function find(string $slug): ?Snippet;

    /**
     * 検索条件に基づいてスニペット一覧をページネーション取得する
     */
    public function paginate(SnippetSearchDto $dto, int $perPage): LengthAwarePaginator;

    /**
     * スニペットを新規作成する
     */
    public function create(SnippetCreateDto $dto): Snippet;

    /**
     * スニペットを更新する
     */
    public function update(Snippet $snippet, SnippetUpdateDto $dto): Snippet;

    /**
     * スニペットを削除する
     */
    public function delete(Snippet $snippet): void;
}
