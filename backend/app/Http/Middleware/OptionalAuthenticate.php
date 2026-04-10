<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Bearerトークンがあれば認証を試み、なければ未認証のまま続行する
 */
class OptionalAuthenticate
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->bearerToken()) {
            Auth::shouldUse('sanctum');
        }

        return $next($request);
    }
}
