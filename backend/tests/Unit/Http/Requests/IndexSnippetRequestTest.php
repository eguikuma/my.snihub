<?php

namespace Tests\Unit\Http\Requests;

use App\Enums\Language;
use App\Http\Requests\IndexSnippetRequest;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class IndexSnippetRequestTest extends TestCase
{
    #[Test]
    public function パラメータなしでバリデーションを通過すること(): void
    {
        $validator = $this->makeValidator([]);

        $this->assertTrue($validator->passes());
    }

    #[Test]
    public function 全パラメータ指定でバリデーションを通過すること(): void
    {
        $validator = $this->makeValidator([
            'keyword' => 'hello',
            'tag' => 'php',
            'language' => Language::Php->value,
            'per_page' => 10,
        ]);

        $this->assertTrue($validator->passes());
    }

    #[Test]
    public function keywordが100文字を超える場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator([
            'keyword' => str_repeat('a', 101),
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('keyword', $validator->errors()->toArray());
    }

    #[Test]
    public function tagが50文字を超える場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator([
            'tag' => str_repeat('a', 51),
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('tag', $validator->errors()->toArray());
    }

    #[Test]
    public function languageがEnum定義外の値の場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator([
            'language' => 'brainfuck',
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('language', $validator->errors()->toArray());
    }

    #[Test]
    public function per_pageが1未満の場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator([
            'per_page' => 0,
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('per_page', $validator->errors()->toArray());
    }

    #[Test]
    public function per_pageが100を超える場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator([
            'per_page' => 101,
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('per_page', $validator->errors()->toArray());
    }

    #[Test]
    public function per_pageが整数でない場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator([
            'per_page' => 'abc',
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('per_page', $validator->errors()->toArray());
    }

    private function makeValidator(array $data): \Illuminate\Validation\Validator
    {
        $request = new IndexSnippetRequest;

        return Validator::make($data, $request->rules());
    }
}
