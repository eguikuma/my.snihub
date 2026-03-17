<?php

namespace Tests\Unit\UseCases\User;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\UseCases\User\GetMeUseCase;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class GetMeUseCaseTest extends TestCase
{
    #[Test]
    public function 認証ユーザーにリレーションをロードして返すこと(): void
    {
        $user = Mockery::mock(User::class);
        $repository = Mockery::mock(UserRepositoryInterface::class);
        $repository->shouldReceive('load')
            ->once()
            ->with($user)
            ->andReturn($user);
        $useCase = new GetMeUseCase($repository);

        $result = $useCase->execute($user);

        $this->assertSame($user, $result);
    }
}
