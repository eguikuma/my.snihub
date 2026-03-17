<?php

namespace App\Http\Requests;

use App\Enums\Language;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * スニペット更新リクエストのバリデーション
 */
class UpdateSnippetRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:100000'],
            'language' => ['required', 'string', Rule::enum(Language::class)],
            'description' => ['nullable', 'string', 'max:1000'],
            'tags' => ['nullable', 'array', 'max:10'],
            'tags.*' => ['string', 'max:50'],
        ];
    }
}
