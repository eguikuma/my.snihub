<?php

namespace App\Console\Commands;

use App\Repositories\Interfaces\SnippetRepositoryInterface;
use Illuminate\Console\Command;

/**
 * 期限切れのスニペットを物理削除する
 *
 * スケジューラーにより毎日 00:00 UTC に実行される
 * 期限の日時は UTC で保存されているため、タイムゾーンを合わせて UTC のままにしている
 */
class PruneExpiredSnippetsCommand extends Command
{
    protected $signature = 'snippets:prune';

    protected $description = '期限切れのスニペットを物理削除する';

    public function handle(SnippetRepositoryInterface $repository): int
    {
        $count = $repository->prune();

        $this->info("{$count}件の期限切れスニペットを削除しました");

        return self::SUCCESS;
    }
}
