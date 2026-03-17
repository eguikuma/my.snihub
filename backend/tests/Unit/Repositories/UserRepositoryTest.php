<?php

namespace Tests\Unit\Repositories;

use App\Models\User;
use App\Repositories\Eloquent\UserRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserRepositoryTest extends TestCase
{
    use RefreshDatabase;

    private UserRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->repository = new UserRepository;
    }

    #[Test]
    public function loadでリレーションがロードされること(): void
    {
        $user = User::factory()->create();

        $result = $this->repository->load($user);

        $this->assertSame($user, $result);
        $this->assertTrue($result->relationLoaded('userProviders'));
    }
}
