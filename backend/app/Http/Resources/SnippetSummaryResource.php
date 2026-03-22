<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * スニペット一覧用のAPIレスポンス構造を定義する
 */
class SnippetSummaryResource extends JsonResource
{
    /** コードプレビューの最大行数 */
    public const CODE_PREVIEW_MAX_LINES = 3;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'code_preview' => $this->toCodePreview(),
            'language' => $this->language,
            'description' => $this->description,
            'visibility' => $this->visibility->value,
            'expires_at' => $this->expires_at?->toIso8601String(),
            'expires_in' => $this->expires_in?->value,
            'tags' => $this->tags->pluck('name')->all(),
            'user' => [
                'name' => $this->user->name,
                'avatar_url' => $this->user->avatar_url,
            ],
            'is_owner' => $request->user()?->id === $this->user_id,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }

    private function toCodePreview(): string
    {
        $lines = explode("\n", $this->code);

        return implode("\n", array_slice($lines, 0, self::CODE_PREVIEW_MAX_LINES));
    }
}
