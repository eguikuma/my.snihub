<?php

namespace Tests\Unit\Models;

use App\Models\Snippet;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SnippetTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function slugは、外部から変更されないよう、mass_assignmentの対象外であること(): void
    {
        $snippet = Snippet::factory()->create();
        $originalSlug = $snippet->slug;

        $snippet->update(['slug' => 'changed1']);

        $this->assertSame($originalSlug, $snippet->fresh()->slug);
    }

    #[Test]
    public function expires_atが過去の場合、スニペットは期限切れと判定されること(): void
    {
        $snippet = Snippet::factory()->create([
            'expires_at' => now()->subHour(),
        ]);

        $this->assertTrue($snippet->is_expired);
    }

    #[Test]
    public function expires_atが未来の場合、スニペットは有効と判定されること(): void
    {
        $snippet = Snippet::factory()->create([
            'expires_at' => now()->addHour(),
        ]);

        $this->assertFalse($snippet->is_expired);
    }

    #[Test]
    public function expires_atがnullの場合、スニペットは無期限で有効と判定されること(): void
    {
        $snippet = Snippet::factory()->create([
            'expires_at' => null,
        ]);

        $this->assertFalse($snippet->is_expired);
    }

    #[Test]
    public function expires_atは、日時比較を安全に行うため、datetimeにキャストされること(): void
    {
        $snippet = Snippet::factory()->create([
            'expires_at' => '2026-12-31 23:59:59',
        ]);

        $this->assertInstanceOf(Carbon::class, $snippet->expires_at);
    }

    #[Test]
    public function スニペットは、作成者を辿れるよう、ユーザーへのリレーションを持つこと(): void
    {
        $user = User::factory()->create();

        $snippet = Snippet::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($snippet->user->is($user));
    }

    #[Test]
    public function スニペットは、分類・検索のため、タグへのリレーションを持つこと(): void
    {
        $snippet = Snippet::factory()->create();
        $tags = Tag::factory()->count(3)->create();

        $snippet->tags()->attach($tags);

        $this->assertCount(3, $snippet->fresh()->tags);
        $this->assertInstanceOf(Tag::class, $snippet->tags->first());
    }
}
