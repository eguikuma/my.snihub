<?php

namespace App\Models;

use Database\Factories\TagFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * スニペットの分類・検索に使用するタグを表す
 */
class Tag extends Model
{
    /** @use HasFactory<TagFactory> */
    use HasFactory;

    /**
     * タグは作成・更新日時の管理が不要なため無効化する
     */
    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    /**
     * このタグが付与されたスニペットを取得する
     *
     * @return BelongsToMany<Snippet, $this>
     */
    public function snippets(): BelongsToMany
    {
        return $this->belongsToMany(Snippet::class);
    }
}
