<?php

namespace Tests\Unit\Http\Requests;

use App\Http\Requests\IndexTagRequest;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class IndexTagRequestTest extends TestCase
{
    #[Test]
    public function パラメータなしでバリデーションを通過すること(): void
    {
        $validator = $this->makeValidator([]);

        $this->assertTrue($validator->passes());
    }

    #[Test]
    public function keyword指定でバリデーションを通過すること(): void
    {
        $validator = $this->makeValidator([
            'keyword' => 'react',
        ]);

        $this->assertTrue($validator->passes());
    }

    #[Test]
    public function keywordが50文字を超える場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator([
            'keyword' => str_repeat('a', 51),
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('keyword', $validator->errors()->toArray());
    }

    #[Test]
    public function keywordが文字列でない場合、バリデーションに失敗すること(): void
    {
        $validator = $this->makeValidator([
            'keyword' => 123,
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('keyword', $validator->errors()->toArray());
    }

    private function makeValidator(array $data): \Illuminate\Validation\Validator
    {
        $request = new IndexTagRequest;

        return Validator::make($data, $request->rules());
    }
}
