<?php

namespace App\Enums;

/**
 * スニペットの有効期限を表す
 */
enum ExpiresIn: string
{
    case OneHour = '1h';
    case OneDay = '1d';
    case OneWeek = '1w';
}
