<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserProvider;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserProvider>
 */
class UserProviderFactory extends Factory
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
            'type' => 'github',
            'external_id' => (string) fake()->unique()->randomNumber(8),
        ];
    }
}
