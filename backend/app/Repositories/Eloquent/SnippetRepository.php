<?php

namespace App\Repositories\Eloquent;

use App\Enums\Visibility;
use App\Models\Snippet;
use App\Repositories\Dtos\SnippetCountDto;
use App\Repositories\Dtos\SnippetCreateDto;
use App\Repositories\Dtos\SnippetSearchDto;
use App\Repositories\Dtos\SnippetUpdateDto;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Eloquent を使用したスニペットのデータ操作を実装する
 */
class SnippetRepository implements SnippetRepositoryInterface
{
    public function find(string $slug): ?Snippet
    {
        return Snippet::with(['user', 'tags'])
            ->where('slug', $slug)
            ->first();
    }

    public function paginate(SnippetSearchDto $dto, int $perPage): LengthAwarePaginator
    {
        $builder = Snippet::with(['user', 'tags']);

        $this->filters(
            $builder,
            userId: $dto->userId,
            visibility: $dto->visibility,
            language: $dto->language,
            tag: $dto->tag,
            keyword: $dto->keyword,
            withExpired: $dto->withExpired,
        );

        return $builder->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function count(SnippetCountDto $dto): array
    {
        $builder = Snippet::query();

        $this->filters(
            $builder,
            userId: $dto->userId,
            visibility: $dto->visibility,
            language: $dto->language,
            tag: $dto->tag,
            keyword: $dto->keyword,
            withExpired: $dto->withExpired,
        );

        if ($dto->groupBy !== null) {
            $column = $dto->groupBy->value;

            return $builder->selectRaw("{$column}, count(*) as count")
                ->groupBy($column)
                ->pluck('count', $column)
                ->map(fn ($value) => (int) $value)
                ->all();
        }

        return ['total' => $builder->count()];
    }

    public function create(SnippetCreateDto $dto): Snippet
    {
        $snippet = Snippet::create([
            'user_id' => $dto->userId,
            'title' => $dto->title,
            'code' => $dto->code,
            'language' => $dto->language,
            'description' => $dto->description,
            'expires_at' => $dto->expiresAt,
            'visibility' => $dto->visibility,
        ]);

        if (! empty($dto->tagIds)) {
            $snippet->tags()->sync($dto->tagIds);
        }

        return $snippet->load('user', 'tags');
    }

    public function update(Snippet $snippet, SnippetUpdateDto $dto): Snippet
    {
        $snippet->update([
            'title' => $dto->title,
            'code' => $dto->code,
            'language' => $dto->language,
            'description' => $dto->description,
            'visibility' => $dto->visibility,
        ]);

        $snippet->tags()->sync($dto->tagIds);

        return $snippet->load('user', 'tags');
    }

    public function delete(Snippet $snippet): void
    {
        $snippet->delete();
    }

    public function prune(): int
    {
        return Snippet::whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->delete();
    }

    /**
     * 共通のフィルタ条件をビルダーに適用する
     *
     * @param  Builder<Snippet>  $builder
     */
    private function filters(
        Builder $builder,
        ?int $userId,
        ?Visibility $visibility,
        ?string $language,
        ?string $tag,
        ?string $keyword,
        bool $withExpired,
    ): void {
        if (! $withExpired) {
            $builder->where(function ($subBuilder) {
                $subBuilder->where('expires_at', '>', now())
                    ->orWhereNull('expires_at');
            });
        }

        if ($userId !== null) {
            $builder->where('user_id', $userId);
        }

        if ($visibility !== null) {
            $builder->where('visibility', $visibility);
        }

        if ($language !== null) {
            $builder->where('language', $language);
        }

        if ($tag !== null) {
            $builder->whereHas('tags', function ($subBuilder) use ($tag) {
                $subBuilder->where('name', $tag);
            });
        }

        if ($keyword !== null) {
            /**
             * PostgreSQL の ILIKE で大文字小文字を区別せず検索する
             */
            $builder->where(function ($subBuilder) use ($keyword) {
                $subBuilder->where('title', 'ILIKE', "%{$keyword}%")
                    ->orWhere('code', 'ILIKE', "%{$keyword}%")
                    ->orWhere('description', 'ILIKE', "%{$keyword}%");
            });
        }
    }
}
