<?php

namespace Tests\Unit\UseCases\Authentication;

use App\Models\User;
use App\UseCases\Authentication\LogoutUseCase;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LogoutUseCaseTest extends TestCase
{
    #[Test]
    public function 現在のトークンが失効すること(): void
    {
        $user = Mockery::mock(User::class);
        $token = Mockery::mock();
        $token->shouldReceive('delete')->once();
        $user->shouldReceive('currentAccessToken')
            ->once()
            ->andReturn($token);
        $useCase = new LogoutUseCase;

        $useCase->execute($user);

        $this->assertTrue(true);
    }
}
