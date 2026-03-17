<?php

namespace Database\Factories;

use App\Enums\Visibility;
use App\Models\Snippet;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Snippet>
 */
class SnippetFactory extends Factory
{
    /**
     * モデルのデフォルト状態を定義する
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'code' => fake()->text(200),
            'language' => fake()->randomElement(['php', 'javascript', 'python', 'go', 'rust']),
            'description' => fake()->optional()->sentence(),
            'expires_at' => null,
            'visibility' => Visibility::Unlisted,
        ];
    }

    /**
     * 公開状態に設定する
     */
    public function public(): static
    {
        return $this->state(fn () => ['visibility' => Visibility::Public]);
    }

    /**
     * 限定公開状態に設定する
     */
    public function unlisted(): static
    {
        return $this->state(fn () => ['visibility' => Visibility::Unlisted]);
    }

    /**
     * 非公開状態に設定する
     */
    public function private(): static
    {
        return $this->state(fn () => ['visibility' => Visibility::Private]);
    }
}
