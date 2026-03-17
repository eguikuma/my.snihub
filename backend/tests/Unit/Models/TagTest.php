<?php

namespace Tests\Unit\Models;

use App\Models\Snippet;
use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TagTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function タグは、作成・更新日時の管理が不要なため、timestampsが無効であること(): void
    {
        $tag = Tag::factory()->create(['name' => 'php']);

        $this->assertFalse($tag->usesTimestamps());
    }

    #[Test]
    public function タグは、紐づくスニペットを検索するため、スニペットへのリレーションを持つこと(): void
    {
        $tag = Tag::factory()->create();
        $snippets = Snippet::factory()->count(2)->create();

        $tag->snippets()->attach($snippets);

        $this->assertCount(2, $tag->fresh()->snippets);
        $this->assertInstanceOf(Snippet::class, $tag->snippets->first());
    }
}
