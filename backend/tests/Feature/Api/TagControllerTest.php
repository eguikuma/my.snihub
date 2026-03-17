<?php

namespace Tests\Feature\Api;

use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TagControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function 未認証でもタグ一覧を取得できること(): void
    {
        Tag::factory()->count(3)->create();

        $response = $this->getJson('/api/tags');

        $response->assertOk();
        $response->assertJsonCount(3, 'data');
    }

    #[Test]
    public function タグが存在しない場合は空配列を返すこと(): void
    {
        $response = $this->getJson('/api/tags');

        $response->assertOk();
        $response->assertExactJson(['data' => []]);
    }

    #[Test]
    public function レスポンスがタグ名の文字列配列であること(): void
    {
        Tag::factory()->create(['name' => 'php']);
        Tag::factory()->create(['name' => 'react']);

        $response = $this->getJson('/api/tags');

        $response->assertOk();
        $response->assertJsonPath('data.0', 'php');
        $response->assertJsonPath('data.1', 'react');
    }

    #[Test]
    public function タグ名がアルファベット順にソートされていること(): void
    {
        Tag::factory()->create(['name' => 'react']);
        Tag::factory()->create(['name' => 'css']);
        Tag::factory()->create(['name' => 'php']);

        $response = $this->getJson('/api/tags');

        $response->assertOk();
        $response->assertExactJson(['data' => ['css', 'php', 'react']]);
    }
}
