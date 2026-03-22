<?php

namespace App\Http\Requests;

use App\Enums\Language;
use App\Enums\Visibility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * スニペット一覧・検索リクエストのバリデーション
 */
class IndexSnippetRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'keyword' => ['nullable', 'string', 'max:100'],
            'tag' => ['nullable', 'string', 'max:50'],
            'language' => ['nullable', 'string', Rule::enum(Language::class)],
            'visibility' => ['nullable', 'string', Rule::enum(Visibility::class)],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
