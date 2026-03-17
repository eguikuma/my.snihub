<?php

namespace App\Models;

use App\Enums\ProviderType;
use Database\Factories\UserProviderFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * OAuth認証に使用する外部プロバイダーの情報を表す
 */
class UserProvider extends Model
{
    /** @use HasFactory<UserProviderFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'external_id',
    ];

    protected function casts(): array
    {
        return [
            'type' => ProviderType::class,
        ];
    }

    /**
     * このプロバイダーが紐づくユーザーを取得する
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
