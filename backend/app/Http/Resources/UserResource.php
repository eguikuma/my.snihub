<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * ユーザーのAPIレスポンス構造を定義する
 */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url,
            'providers' => $this->userProviders->pluck('type'),
            'created_at' => $this->created_at,
        ];
    }
}
