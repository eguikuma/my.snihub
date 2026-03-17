<?php

namespace Tests\Feature\Api;

use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class JsonResponseTest extends TestCase
{
    #[Test]
    public function Acceptヘッダーなしでも、APIルートはJSONでエラーを返すこと(): void
    {
        $response = $this->get('/api/snippets/nonexist');

        $response->assertStatus(Response::HTTP_NOT_FOUND);
        $response->assertHeader('Content-Type', 'application/json');
        $response->assertJson(['message' => Response::$statusTexts[Response::HTTP_NOT_FOUND]]);
    }

    #[Test]
    public function AcceptにHTMLを指定しても、APIルートはJSONでエラーを返すこと(): void
    {
        $response = $this->get('/api/snippets/nonexist', ['Accept' => 'text/html']);

        $response->assertStatus(Response::HTTP_NOT_FOUND);
        $response->assertHeader('Content-Type', 'application/json');
        $response->assertJson(['message' => Response::$statusTexts[Response::HTTP_NOT_FOUND]]);
    }

    #[Test]
    public function 定義されていないAPIルートも、JSONで404を返すこと(): void
    {
        $response = $this->get('/api/nonexist');

        $response->assertStatus(Response::HTTP_NOT_FOUND);
        $response->assertHeader('Content-Type', 'application/json');
        $response->assertJson(['message' => Response::$statusTexts[Response::HTTP_NOT_FOUND]]);
    }

    #[Test]
    public function 非APIパスへのアクセスは、空レスポンスで404を返すこと(): void
    {
        $response = $this->get('/');

        $response->assertNoContent(Response::HTTP_NOT_FOUND);
    }
}
