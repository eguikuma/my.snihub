<?php

namespace Tests\Feature\Commands;

use App\Models\Snippet;
use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PruneExpiredSnippetsCommandTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function 期限切れスニペットが削除されること(): void
    {
        Snippet::factory()->create(['expires_at' => now()->subDay()]);
        Snippet::factory()->create(['expires_at' => now()->addDay()]);
        Snippet::factory()->create(['expires_at' => null]);

        $this->artisan('snippets:prune')
            ->assertSuccessful()
            ->expectsOutputToContain('1');

        $this->assertDatabaseCount('snippets', 2);
    }

    #[Test]
    public function 削除対象がない場合、0件のメッセージが出力されること(): void
    {
        Snippet::factory()->create(['expires_at' => now()->addDay()]);

        $this->artisan('snippets:prune')
            ->assertSuccessful()
            ->expectsOutputToContain('0');

        $this->assertDatabaseCount('snippets', 1);
    }

    #[Test]
    public function タグが紐づいた期限切れスニペットも削除され、タグ自体は残ること(): void
    {
        $expired = Snippet::factory()->create(['expires_at' => now()->subDay()]);
        $tag = Tag::factory()->create(['name' => 'php']);
        $expired->tags()->attach($tag);

        $this->artisan('snippets:prune')
            ->assertSuccessful();

        $this->assertDatabaseCount('snippets', 0);
        $this->assertDatabaseCount('snippet_tag', 0);
        $this->assertDatabaseHas('tags', ['name' => 'php']);
    }

    #[Test]
    public function 期限がちょうど現在時刻のスニペットは削除されないこと(): void
    {
        $this->freezeTime();
        Snippet::factory()->create(['expires_at' => now()]);

        $this->artisan('snippets:prune')
            ->assertSuccessful()
            ->expectsOutputToContain('0');

        $this->assertDatabaseCount('snippets', 1);
    }
}
