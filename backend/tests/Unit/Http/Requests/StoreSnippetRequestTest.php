<?php

namespace Tests\Unit\Http\Requests;

use App\Enums\ExpiresIn;
use App\Enums\Language;
use App\Http\Requests\StoreSnippetRequest;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class StoreSnippetRequestTest extends TestCase
{
    #[Test]
    public function 必須項目が全て揃っている場合、バリデーションを通過すること(): void
    {
        $validator = $this->makeValidator($this->validData());

        $this->assertTrue($validator->passes());
    }

    #[Test]
    public function 任意項目を含む場合もバリデーションを通過すること(): void
    {
        $validator = $this->makeValidator($this->validData([
            'description' => 'PHPのHello Worldサンプル',
            'expires_in' => ExpiresIn::OneDay->value,
            'tags' => ['php', 'sample'],
        ]));

        $this->assertTrue($validator->passes());
    }

    #[Test]
    public function titleが未指定の場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator($this->validData(['title' => '']));

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('title', $validator->errors()->toArray());
    }

    #[Test]
    public function titleが255文字を超える場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator($this->validData([
            'title' => str_repeat('あ', 256),
        ]));

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('title', $validator->errors()->toArray());
    }

    #[Test]
    public function codeが未指定の場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator($this->validData(['code' => '']));

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('code', $validator->errors()->toArray());
    }

    #[Test]
    public function codeが100000文字を超える場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator($this->validData([
            'code' => str_repeat('a', 100001),
        ]));

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('code', $validator->errors()->toArray());
    }

    #[Test]
    public function languageが未指定の場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator($this->validData(['language' => '']));

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('language', $validator->errors()->toArray());
    }

    #[Test]
    public function languageがEnum定義外の値の場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator($this->validData([
            'language' => 'brainfuck',
        ]));

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('language', $validator->errors()->toArray());
    }

    #[Test]
    public function descriptionが1000文字を超える場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator($this->validData([
            'description' => str_repeat('あ', 1001),
        ]));

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('description', $validator->errors()->toArray());
    }

    #[Test]
    public function expires_inがEnum定義外の値の場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator($this->validData([
            'expires_in' => '1y',
        ]));

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('expires_in', $validator->errors()->toArray());
    }

    #[Test]
    public function tagsが配列でない場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator($this->validData([
            'tags' => 'php',
        ]));

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('tags', $validator->errors()->toArray());
    }

    #[Test]
    public function tagsの要素が50文字を超える場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator($this->validData([
            'tags' => [str_repeat('a', 51)],
        ]));

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('tags.0', $validator->errors()->toArray());
    }

    #[Test]
    public function tagsが10個を超える場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator($this->validData([
            'tags' => array_fill(0, 11, 'tag'),
        ]));

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('tags', $validator->errors()->toArray());
    }

    /**
     * バリデーション対象のデータからValidatorインスタンスを生成する
     */
    private function makeValidator(array $data): \Illuminate\Validation\Validator
    {
        $request = new StoreSnippetRequest;

        return Validator::make($data, $request->rules());
    }

    /**
     * 有効なリクエストデータを返す
     */
    private function validData(array $overrides = []): array
    {
        return array_merge([
            'title' => 'テストスニペット',
            'code' => 'echo "Hello, World!";',
            'language' => Language::Php->value,
        ], $overrides);
    }
}
