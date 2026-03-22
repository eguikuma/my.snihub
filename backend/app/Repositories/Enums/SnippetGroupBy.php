<?php

namespace App\Repositories\Enums;

/**
 * スニペット集計時のグルーピング対象カラムを表す
 */
enum SnippetGroupBy: string
{
    case Visibility = 'visibility';
    case Language = 'language';
}
