<?php

namespace Tests\Unit\UseCases\Snippet;

use App\Models\User;
use App\Repositories\Interfaces\SnippetRepositoryInterface;
use App\UseCases\Snippet\Dtos\SnippetSearchDto;
use App\UseCases\Snippet\SearchSnippetsUseCase;
use Illuminate\Pagination\LengthAwarePaginator;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SearchSnippetsUseCaseTest extends TestCase
{
    #[Test]
    public function 検索条件がリポジトリDTOに変換されて渡されること(): void
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('getAttribute')->with('id')->andReturn(42);
        $paginator = new LengthAwarePaginator([], 0, 20);
        $capturedDto = null;
        $repository = Mockery::mock(SnippetRepositoryInterface::class);
        $repository->shouldReceive('paginate')
            ->once()
            ->with(Mockery::capture($capturedDto), 20)
            ->andReturn($paginator);
        $dto = new SnippetSearchDto(
            keyword: 'hooks',
            tag: 'react',
            language: 'typescript',
            perPage: 20,
        );
        $useCase = new SearchSnippetsUseCase($repository);

        $result = $useCase->execute($user, $dto);

        $this->assertSame($paginator, $result);
        $this->assertSame('hooks', $capturedDto?->keyword);
        $this->assertSame('react', $capturedDto?->tag);
        $this->assertSame('typescript', $capturedDto?->language);
        $this->assertSame(42, $capturedDto?->userId);
        $this->assertFalse($capturedDto?->withExpired);
    }
}
