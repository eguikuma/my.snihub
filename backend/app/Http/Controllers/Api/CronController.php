<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Artisan;

/**
 * 外部からのCronリクエストを処理する
 */
class CronController extends Controller
{
    /**
     * 期限切れのスニペットを削除する
     */
    public function prune(Request $request): Response
    {
        $secret = config('app.cron_secret');

        if (! $secret || ! hash_equals($secret, (string) $request->bearerToken())) {
            abort(Response::HTTP_UNAUTHORIZED);
        }

        Artisan::call('snippets:prune');

        return response()->noContent();
    }
}
