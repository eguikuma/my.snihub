<?php

namespace App\Repositories\Eloquent;

use App\Models\Snippet;
use App\Repositories\Dtos\SnippetCreateDto;
use App\Repositories\Dtos\SnippetSearchDto;
use App\Repositories\Dtos\SnippetUpdateDto;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

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

        if (! $dto->withExpired) {
            $builder->where(function ($subBuilder) {
                $subBuilder->where('expires_at', '>', now())
                    ->orWhereNull('expires_at');
            });
        }

        if ($dto->userId !== null) {
            $builder->where('user_id', $dto->userId);
        }

        if ($dto->language !== null) {
            $builder->where('language', $dto->language);
        }

        if ($dto->tag !== null) {
            $builder->whereHas('tags', function ($subBuilder) use ($dto) {
                $subBuilder->where('name', $dto->tag);
            });
        }

        if ($dto->keyword !== null) {
            /**
             * PostgreSQL の ILIKE で大文字小文字を区別せず検索する
             */
            $builder->where(function ($subBuilder) use ($dto) {
                $subBuilder->where('title', 'ILIKE', "%{$dto->keyword}%")
                    ->orWhere('code', 'ILIKE', "%{$dto->keyword}%")
                    ->orWhere('description', 'ILIKE', "%{$dto->keyword}%");
            });
        }

        return $builder->orderByDesc('created_at')
            ->paginate($perPage);
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
        ]);

        if (! empty($dto->tagIds)) {
            $snippet->tags()->sync($dto->tagIds);
        }

        return $snippet;
    }

    public function update(Snippet $snippet, SnippetUpdateDto $dto): Snippet
    {
        $snippet->update([
            'title' => $dto->title,
            'code' => $dto->code,
            'language' => $dto->language,
            'description' => $dto->description,
        ]);

        $snippet->tags()->sync($dto->tagIds);

        return $snippet;
    }

    public function delete(Snippet $snippet): void
    {
        $snippet->delete();
    }
}
