<?php

namespace Tests\Unit\Repositories;

use App\Enums\Visibility;
use App\Models\Snippet;
use App\Models\Tag;
use App\Models\User;
use App\Repositories\Dtos\SnippetCreateDto;
use App\Repositories\Dtos\SnippetSearchDto;
use App\Repositories\Dtos\SnippetUpdateDto;
use App\Repositories\Eloquent\SnippetRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SnippetRepositoryTest extends TestCase
{
    use RefreshDatabase;

    private SnippetRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->repository = new SnippetRepository;
    }

    #[Test]
    public function findで、存在するスニペットを取得できること(): void
    {
        $snippet = Snippet::factory()->create();

        $found = $this->repository->find($snippet->slug);

        $this->assertNotNull($found);
        $this->assertTrue($found->is($snippet));
        $this->assertTrue($found->relationLoaded('user'));
        $this->assertTrue($found->relationLoaded('tags'));
    }

    #[Test]
    public function findで、存在しないslugの場合、nullを返すこと(): void
    {
        $found = $this->repository->find('nonexist');

        $this->assertNull($found);
    }

    #[Test]
    public function paginateで、withExpiredがfalseの場合、期限切れスニペットが除外されること(): void
    {
        Snippet::factory()->create(['expires_at' => now()->subDay()]);
        $valid = Snippet::factory()->create(['expires_at' => now()->addDay()]);
        $noExpiry = Snippet::factory()->create(['expires_at' => null]);

        $result = $this->repository->paginate(new SnippetSearchDto(withExpired: false), 20);

        $this->assertCount(2, $result->items());
        $slugs = collect($result->items())->pluck('slug')->all();
        $this->assertContains($valid->slug, $slugs);
        $this->assertContains($noExpiry->slug, $slugs);
    }

    #[Test]
    public function paginateで、withExpiredがtrueの場合、期限切れスニペットも含まれること(): void
    {
        Snippet::factory()->create(['expires_at' => now()->subDay()]);
        Snippet::factory()->create(['expires_at' => now()->addDay()]);
        Snippet::factory()->create(['expires_at' => null]);

        $result = $this->repository->paginate(new SnippetSearchDto(withExpired: true), 20);

        $this->assertCount(3, $result->items());
    }

    #[Test]
    public function paginateで、タグフィルタが適用されること(): void
    {
        $tag = Tag::factory()->create(['name' => 'php']);
        $taggedSnippet = Snippet::factory()->create();
        $taggedSnippet->tags()->attach($tag);
        Snippet::factory()->create();

        $result = $this->repository->paginate(new SnippetSearchDto(tag: 'php'), 20);

        $this->assertCount(1, $result->items());
        $this->assertTrue($result->items()[0]->is($taggedSnippet));
    }

    #[Test]
    public function paginateで、言語フィルタが適用されること(): void
    {
        $snippet = Snippet::factory()->create(['language' => 'typescript']);
        Snippet::factory()->create(['language' => 'python']);

        $result = $this->repository->paginate(new SnippetSearchDto(language: 'typescript'), 20);

        $this->assertCount(1, $result->items());
        $this->assertTrue($result->items()[0]->is($snippet));
    }

    #[Test]
    public function paginateで、キーワード検索がtitleとcodeとdescriptionに適用されること(): void
    {
        $byTitle = Snippet::factory()->create(['title' => 'React hooks example']);
        $byCode = Snippet::factory()->create(['code' => 'const useHooks = () => {}']);
        $byDesc = Snippet::factory()->create(['description' => 'A hooks tutorial']);
        Snippet::factory()->create([
            'title' => 'Unrelated',
            'code' => 'unrelated code',
            'description' => 'nothing here',
        ]);

        $result = $this->repository->paginate(new SnippetSearchDto(keyword: 'hooks'), 20);

        $this->assertCount(3, $result->items());
        $slugs = collect($result->items())->pluck('slug')->all();
        $this->assertContains($byTitle->slug, $slugs);
        $this->assertContains($byCode->slug, $slugs);
        $this->assertContains($byDesc->slug, $slugs);
    }

    #[Test]
    public function paginateで、ユーザーフィルタが適用されること(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $mine = Snippet::factory()->create(['user_id' => $user->id]);
        Snippet::factory()->create(['user_id' => $other->id]);

        $result = $this->repository->paginate(new SnippetSearchDto(userId: $user->id), 20);

        $this->assertCount(1, $result->items());
        $this->assertTrue($result->items()[0]->is($mine));
    }

    #[Test]
    public function paginateで、visibilityフィルタが適用されること(): void
    {
        Snippet::factory()->create(['visibility' => Visibility::Public]);
        Snippet::factory()->create(['visibility' => Visibility::Unlisted]);
        Snippet::factory()->create(['visibility' => Visibility::Private]);

        $result = $this->repository->paginate(new SnippetSearchDto(visibility: Visibility::Public), 20);

        $this->assertCount(1, $result->items());
        $this->assertSame(Visibility::Public, $result->items()[0]->visibility);
    }

    #[Test]
    public function createで、スニペットが作成されること(): void
    {
        $user = User::factory()->create();

        $snippet = $this->repository->create(new SnippetCreateDto(
            userId: $user->id,
            title: 'Test Snippet',
            code: 'echo "hello";',
            language: 'php',
            visibility: Visibility::Unlisted,
        ));

        $this->assertDatabaseHas('snippets', [
            'id' => $snippet->id,
            'user_id' => $user->id,
            'title' => 'Test Snippet',
        ]);
        $this->assertTrue($snippet->relationLoaded('user'));
        $this->assertTrue($snippet->relationLoaded('tags'));
    }

    #[Test]
    public function createで、タグが同期されること(): void
    {
        $user = User::factory()->create();
        $tag1 = Tag::factory()->create();
        $tag2 = Tag::factory()->create();

        $snippet = $this->repository->create(new SnippetCreateDto(
            userId: $user->id,
            title: 'Test',
            code: 'code',
            language: 'php',
            visibility: Visibility::Unlisted,
            tagIds: [$tag1->id, $tag2->id],
        ));

        $this->assertCount(2, $snippet->tags);
    }

    #[Test]
    public function updateで、スニペットが更新されること(): void
    {
        $snippet = Snippet::factory()->create(['title' => 'Original']);

        $updated = $this->repository->update($snippet, new SnippetUpdateDto(
            title: 'Updated',
            code: $snippet->code,
            language: $snippet->language,
            visibility: Visibility::Unlisted,
        ));

        $this->assertSame('Updated', $updated->title);
        $this->assertDatabaseHas('snippets', ['id' => $snippet->id, 'title' => 'Updated']);
        $this->assertTrue($updated->relationLoaded('user'));
        $this->assertTrue($updated->relationLoaded('tags'));
    }

    #[Test]
    public function updateで、タグが再同期されること(): void
    {
        $tag1 = Tag::factory()->create();
        $tag2 = Tag::factory()->create();
        $snippet = Snippet::factory()->create();
        $snippet->tags()->attach($tag1);

        $this->repository->update($snippet, new SnippetUpdateDto(
            title: $snippet->title,
            code: $snippet->code,
            language: $snippet->language,
            visibility: Visibility::Unlisted,
            tagIds: [$tag2->id],
        ));

        $this->assertCount(1, $snippet->fresh()->tags);
        $this->assertTrue($snippet->fresh()->tags->first()->is($tag2));
    }

    #[Test]
    public function deleteで、スニペットが削除されること(): void
    {
        $snippet = Snippet::factory()->create();

        $this->repository->delete($snippet);

        $this->assertDatabaseMissing('snippets', ['id' => $snippet->id]);
    }
}
