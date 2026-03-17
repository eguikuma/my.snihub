<?php

namespace App\Http\Requests;

use App\Enums\ExpiresIn;
use App\Enums\Language;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * スニペット作成リクエストのバリデーション
 */
class StoreSnippetRequest extends FormRequest
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
            'expires_in' => ['nullable', 'string', Rule::enum(ExpiresIn::class)],
            'tags' => ['nullable', 'array', 'max:10'],
            'tags.*' => ['string', 'max:50'],
        ];
    }
}
