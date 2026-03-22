<?php

namespace Database\Seeders;

use App\Enums\Visibility;
use App\Models\Snippet;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class LocalSeeder extends Seeder
{
    /** シードデータCSVのディレクトリ */
    private const string DATA_DIR = __DIR__.'/data';

    /**
     * ローカル開発用のシードデータを投入する
     */
    public function run(): void
    {
        $users = $this->seedUsers();
        $tags = $this->seedTags();
        $this->seedSnippets($users, $tags);
    }

    /**
     * ユーザーCSVを読み込んで作成する
     *
     * @return list<User>
     */
    private function seedUsers(): array
    {
        return $this->readCsv('users.csv')
            ->map(fn (array $row) => User::factory()->create([
                'name' => $row['name'],
                'email' => $row['email'],
            ]))
            ->all();
    }

    /**
     * タグCSVを読み込んで作成する
     *
     * @return Collection<int, Tag>
     */
    private function seedTags(): Collection
    {
        return $this->readCsv('tags.csv')
            ->map(fn (array $row) => Tag::factory()->create([
                'name' => $row['name'],
            ]));
    }

    /**
     * スニペットCSVを読み込んで作成する
     *
     * @param  list<User>  $users
     * @param  Collection<int, Tag>  $tags
     */
    private function seedSnippets(array $users, Collection $tags): void
    {
        $snippetRows = $this->readCsv('snippets.csv');

        $snippetRows->each(function (array $row, int $index) use ($users, $tags, $snippetRows) {
            $visibility = Visibility::from($row['visibility'] ?: 'public');

            $snippet = Snippet::factory()->create([
                'user_id' => $users[$index % count($users)]->id,
                'title' => $row['title'],
                'code' => $row['code'],
                'language' => $row['language'],
                'description' => $row['description'],
                'visibility' => $visibility,
                'expires_at' => $row['expires_at'] ?: null,
                'created_at' => now()->subDays($snippetRows->count() - $index),
            ]);

            $snippet->tags()->attach(
                $tags->random(rand(1, 3))->pluck('id'),
            );
        });
    }

    /**
     * CSVファイルをCollectionとして読み込む
     *
     * @return Collection<int, array<string, string>>
     */
    private function readCsv(string $filename): Collection
    {
        $path = self::DATA_DIR.'/'.$filename;
        $handle = fopen($path, 'r');
        $headers = fgetcsv($handle, escape: '');
        $rows = collect();

        while (($data = fgetcsv($handle, escape: '')) !== false) {
            $rows->push(array_combine($headers, $data));
        }

        fclose($handle);

        return $rows;
    }
}
