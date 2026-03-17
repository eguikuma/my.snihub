<?php

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        commands: __DIR__.'/../routes/console.php',
        using: function () {
            /**
             * 現時点で web ルートを利用する予定がないため、api ルートのみを読み込む
             */
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            /**
             * 定義されていないルートへのアクセスは無効にする
             */
            Route::fallback(function () {
                if (request()->is('api/*')) {
                    return response()->json(
                        ['message' => Response::$statusTexts[Response::HTTP_NOT_FOUND]],
                        Response::HTTP_NOT_FOUND,
                    );
                }

                return response()->noContent(Response::HTTP_NOT_FOUND);
            });
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        /**
         * Accept ヘッダーに関わらず常に JSON でエラーを返す
         */
        $exceptions->shouldRenderJsonWhen(fn () => true);

        /**
         * 例外メッセージに内部情報が含まれないようにする
         */
        $exceptions->render(function (Throwable $exception) {
            /**
             * バリデーションエラーとレート制限エラーは、フィールドごとのエラー詳細や再試行までの時間など、クライアントに必要な情報を含むため除外する
             */
            if ($exception instanceof ValidationException ||
                $exception instanceof ThrottleRequestsException) {
                return null;
            }

            /**
             * その他の例外は、例外メッセージに内部情報が含まれている可能性があるため、一般的なエラーメッセージを返す
             */
            $status = match (true) {
                $exception instanceof ModelNotFoundException,
                $exception instanceof NotFoundHttpException => Response::HTTP_NOT_FOUND,
                $exception instanceof AuthenticationException => Response::HTTP_UNAUTHORIZED,
                $exception instanceof AccessDeniedHttpException,
                $exception instanceof AuthorizationException => Response::HTTP_FORBIDDEN,
                $exception instanceof HttpException => $exception->getStatusCode(),
                default => Response::HTTP_INTERNAL_SERVER_ERROR,
            };

            return response()->json(
                ['message' => Response::$statusTexts[$status]],
                $status,
            );
        });
    })->create();
