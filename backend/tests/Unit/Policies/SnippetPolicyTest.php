<?php

namespace Tests\Unit\Policies;

use App\Models\Snippet;
use App\Models\User;
use App\Policies\SnippetPolicy;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SnippetPolicyTest extends TestCase
{
    private SnippetPolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();

        $this->policy = new SnippetPolicy;
    }

    #[Test]
    public function 作成者はスニペットを更新できること(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(1);

        $result = $this->policy->update($user, $snippet);

        $this->assertTrue($result);
    }

    #[Test]
    public function 作成者以外はスニペットを更新できないこと(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(2);

        $result = $this->policy->update($user, $snippet);

        $this->assertFalse($result);
    }

    #[Test]
    public function 作成者はスニペットを削除できること(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(1);

        $result = $this->policy->delete($user, $snippet);

        $this->assertTrue($result);
    }

    #[Test]
    public function 作成者以外はスニペットを削除できないこと(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $snippet = Mockery::mock(Snippet::class);
        $snippet->shouldReceive('getAttribute')->with('user_id')->andReturn(2);

        $result = $this->policy->delete($user, $snippet);

        $this->assertFalse($result);
    }
}
