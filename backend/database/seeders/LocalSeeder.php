<?php

namespace Database\Seeders;

use App\Enums\Visibility;
use App\Models\Snippet;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class LocalSeeder extends Seeder
{
    /**
     * ローカル開発用のシードデータを投入する
     */
    public function run(): void
    {
        $users = [
            User::factory()->create(['name' => 'Taro Yamada', 'email' => 'taro@example.com']),
            User::factory()->create(['name' => 'Hanako Sato', 'email' => 'hanako@example.com']),
            User::factory()->create(['name' => 'Jiro Tanaka', 'email' => 'jiro@example.com']),
        ];

        $tags = collect([
            'api', 'frontend', 'backend', 'docker', 'laravel', 'react', 'database', 'testing',
            'authentication', 'middleware', 'validation', 'eloquent', 'migration', 'seeder',
            'typescript', 'nextjs', 'tailwindcss', 'zustand', 'zod', 'eslint', 'prettier',
            'postgresql', 'redis', 'ci-cd', 'github-actions', 'deployment', 'nginx', 'aws',
            'rest-api', 'graphql', 'websocket', 'oauth', 'jwt', 'cors', 'rate-limiting',
            'unit-test', 'integration-test', 'e2e-test', 'phpunit', 'jest', 'playwright',
            'performance', 'caching', 'logging', 'monitoring', 'error-handling', 'security',
        ])->map(fn (string $name) => Tag::factory()->create(['name' => $name]));

        /** @var array<int, array{title: string, language: string, code: string, description: string, visibility?: string, expires_at?: string}> $snippets */
        $snippets = require __DIR__.'/local-snippets.php';

        foreach ($snippets as $index => $data) {
            $visibility = Visibility::from($data['visibility'] ?? 'public');

            $snippet = Snippet::factory()->create([
                'user_id' => $users[$index % count($users)]->id,
                'title' => $data['title'],
                'code' => $data['code'],
                'language' => $data['language'],
                'description' => $data['description'],
                'visibility' => $visibility,
                'expires_at' => $data['expires_at'] ?? null,
                'created_at' => now()->subDays(count($snippets) - $index),
            ]);

            $snippet->tags()->attach(
                $tags->random(rand(1, 3))->pluck('id'),
            );
        }
    }
}
