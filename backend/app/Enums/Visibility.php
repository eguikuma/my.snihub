<?php

namespace App\Enums;

/**
 * スニペットの公開範囲を表す
 */
enum Visibility: string
{
    case Public = 'public';
    case Unlisted = 'unlisted';
    case Private = 'private';
}
