<?php

namespace App\Models;

use Database\Factories\SnippetFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

/**
 * ユーザーが共有するコードスニペットを表す
 */
class Snippet extends Model
{
    /** @use HasFactory<SnippetFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'code',
        'language',
        'description',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
        ];
    }

    /**
     * 作成時にslugが未設定であれば、8文字のランダム文字列を自動生成する
     */
    protected static function booted(): void
    {
        static::creating(function (Snippet $snippet): void {
            if (empty($snippet->slug)) {
                $snippet->slug = Str::random(8);
            }
        });
    }

    /**
     * スニペットが期限切れかどうかを判定する
     *
     * expires_atがnullの場合は無期限として有効と判定する
     *
     * @return Attribute<bool, never>
     */
    protected function isExpired(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->expires_at !== null && $this->expires_at->isPast(),
        );
    }

    /**
     * スニペットを作成したユーザーを取得する
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * スニペットに付与されたタグを取得する
     *
     * @return BelongsToMany<Tag, $this>
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }
}
