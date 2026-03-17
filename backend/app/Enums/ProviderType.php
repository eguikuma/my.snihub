<?php

namespace App\Enums;

/**
 * OAuth認証プロバイダーの種別を表す
 */
enum ProviderType: string
{
    case Github = 'github';
}
