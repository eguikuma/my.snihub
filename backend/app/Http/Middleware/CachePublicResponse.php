<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * 公開APIのレスポンスにキャッシュヘッダーを付与する
 */
class CachePublicResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($response->isSuccessful() && ! $request->bearerToken()) {
            $response->headers->set(
                'Cache-Control',
                'public, s-maxage=300, stale-while-revalidate=600',
            );
        }

        return $response;
    }
}
