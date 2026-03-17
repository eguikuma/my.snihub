<?php

/**
 * ローカル開発用のスニペットシードデータ
 *
 * visibility を省略すると public になる
 * expires_at を省略すると無期限になる
 */
return [
    [
        'title' => 'LaravelでAPIリソースを定義する',
        'language' => 'php',
        'description' => 'Eloquentモデルを安全にJSON変換するAPIリソースの実装例。レスポンスの構造をコントローラから分離し、フィールドの取捨選択やネスト構造の定義を一箇所に集約できる',
        'code' => <<<'CODE'
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SnippetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'code' => $this->code,
            'language' => $this->language,
            'description' => $this->description,
            'visibility' => $this->visibility->value,
            'expires_at' => $this->expires_at?->toIso8601String(),
            'tags' => $this->tags->pluck('name'),
            'user' => [
                'name' => $this->user->name,
                'avatar_url' => $this->user->avatar_url,
            ],
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
CODE,
    ],
    [
        'title' => 'ReactでuseReducerを使った複雑な状態管理',
        'language' => 'typescript',
        'description' => 'フォームのバリデーションや送信状態など、複数のフィールドが絡む状態をuseReducerでまとめて管理するパターン。useStateの乱立を避け、状態遷移を明示的にする',
        'code' => <<<'CODE'
import { useReducer } from "react";

type FormState = {
  title: string;
  code: string;
  language: string;
  errors: Record<string, string>;
  isSubmitting: boolean;
};

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "SET_ERROR"; field: string; message: string }
  | { type: "CLEAR_ERRORS" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_END" };

const initialState: FormState = {
  title: "",
  code: "",
  language: "typescript",
  errors: {},
  isSubmitting: false,
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message },
      };
    case "CLEAR_ERRORS":
      return { ...state, errors: {} };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true, errors: {} };
    case "SUBMIT_END":
      return { ...state, isSubmitting: false };
  }
};

export const useSnippetForm = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const setField = (field: keyof FormState, value: string) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const validate = (): boolean => {
    dispatch({ type: "CLEAR_ERRORS" });
    let isValid = true;

    if (!state.title.trim()) {
      dispatch({ type: "SET_ERROR", field: "title", message: "タイトルは必須です" });
      isValid = false;
    }

    if (!state.code.trim()) {
      dispatch({ type: "SET_ERROR", field: "code", message: "コードは必須です" });
      isValid = false;
    }

    return isValid;
  };

  return { state, setField, validate, dispatch };
};
CODE,
    ],
    [
        'title' => 'PythonでCLIツールをclickで構築する',
        'language' => 'python',
        'description' => 'clickライブラリを使ったCLIツールの実装。サブコマンド・オプション・引数のバリデーション・ヘルプ自動生成を備え、argparseより直感的にコマンドラインインターフェースを構築できる',
        'code' => <<<'CODE'
import click
import json
from pathlib import Path
from datetime import datetime


@click.group()
@click.version_option("1.0.0")
def cli():
    """スニペット管理CLIツール"""
    pass


@cli.command()
@click.argument("title")
@click.option("--language", "-l", default="python", help="プログラミング言語")
@click.option("--file", "-f", type=click.Path(exists=True), help="コードファイルのパス")
@click.option("--public/--private", default=True, help="公開設定")
def create(title: str, language: str, file: str | None, public: bool):
    """新しいスニペットを作成する"""
    if file:
        code = Path(file).read_text()
    else:
        code = click.edit("# ここにコードを入力")
        if code is None:
            click.echo("キャンセルされました", err=True)
            return

    snippet = {
        "title": title,
        "language": language,
        "code": code,
        "visibility": "public" if public else "private",
        "created_at": datetime.now().isoformat(),
    }

    click.echo(f"スニペットを作成しました: {title}")
    click.echo(json.dumps(snippet, indent=2, ensure_ascii=False))


@cli.command()
@click.argument("query")
@click.option("--language", "-l", help="言語でフィルタ")
@click.option("--limit", "-n", default=10, help="表示件数")
def search(query: str, language: str | None, limit: int):
    """スニペットを検索する"""
    click.echo(f"検索中: {query} (言語: {language or '全て'}, 上限: {limit}件)")


if __name__ == "__main__":
    cli()
CODE,
    ],
    [
        'title' => 'GoでHTTPミドルウェアチェーンを実装する',
        'language' => 'go',
        'description' => 'net/httpの標準ライブラリだけでミドルウェアパターンを実現する方法。ロギング・認証・CORS・リカバリーなど、横断的関心事をハンドラの前後に差し込む構成を示す',
        'code' => <<<'CODE'
package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

type Middleware func(http.Handler) http.Handler

func Chain(handler http.Handler, middlewares ...Middleware) http.Handler {
	for i := len(middlewares) - 1; i >= 0; i-- {
		handler = middlewares[i](handler)
	}
	return handler
}

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
	})
}

func Recovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("panic recovered: %v", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func CORS(origin string) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/snippets", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"data": []}`)
	})

	handler := Chain(mux, Recovery, Logger, CORS("http://localhost:3000"))

	log.Println("Server starting on :8080")
	http.ListenAndServe(":8080", handler)
}
CODE,
    ],
    [
        'title' => 'RustでCLIツールをclapで構築する',
        'language' => 'rust',
        'description' => 'clapクレートのderive APIを使い、構造体からコマンドライン引数を自動解析するCLIツール。サブコマンド・デフォルト値・バリデーションを型安全に定義でき、ヘルプメッセージも自動生成される',
        'code' => <<<'CODE'
use clap::{Parser, Subcommand};
use std::fs;
use std::path::PathBuf;

#[derive(Parser)]
#[command(name = "snip", version, about = "スニペット管理ツール")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// 新しいスニペットを作成する
    Create {
        /// スニペットのタイトル
        title: String,
        /// コードファイルのパス
        #[arg(short, long)]
        file: PathBuf,
        /// プログラミング言語
        #[arg(short, long, default_value = "rust")]
        language: String,
        /// 公開設定
        #[arg(long, default_value_t = true)]
        public: bool,
    },
    /// スニペットを検索する
    Search {
        /// 検索クエリ
        query: String,
        /// 表示件数の上限
        #[arg(short = 'n', long, default_value_t = 10)]
        limit: usize,
    },
    /// スニペットの詳細を表示する
    Show {
        /// スニペットのslug
        slug: String,
    },
}

fn main() {
    let cli = Cli::parse();

    match cli.command {
        Commands::Create {
            title,
            file,
            language,
            public,
        } => {
            let code = fs::read_to_string(&file).expect("ファイルの読み取りに失敗しました");
            let visibility = if public { "public" } else { "private" };
            println!("作成: {} ({}, {}, {}行)", title, language, visibility, code.lines().count());
        }
        Commands::Search { query, limit } => {
            println!("検索中: \"{}\" (上限: {}件)", query, limit);
        }
        Commands::Show { slug } => {
            println!("表示: {}", slug);
        }
    }
}
CODE,
    ],
    [
        'title' => 'Docker Composeで本格的な開発環境を構築する',
        'language' => 'yaml',
        'description' => 'アプリサーバー・データベース・キャッシュ・メールサーバーを含む開発環境の構成。ヘルスチェック・ボリュームマウント・環境変数の分離など、実運用を見据えた設定を含む',
        'code' => <<<'CODE'
services:
  backend:
    build:
      context: ./backend
      target: development
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
      - backend-vendor:/app/vendor
    depends_on:
      database:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      APP_ENV: local
      DB_HOST: database
      DB_DATABASE: snipshare
      DB_USERNAME: snipshare
      DB_PASSWORD: secret
      REDIS_HOST: redis
      MAIL_HOST: mailpit

  frontend:
    build:
      context: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - frontend-node-modules:/app/node_modules
    environment:
      BACKEND_URL: http://backend:8000

  database:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    volumes:
      - database-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: snipshare
      POSTGRES_USER: snipshare
      POSTGRES_PASSWORD: secret
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U snipshare"]
      interval: 5s
      timeout: 3s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  mailpit:
    image: axllent/mailpit
    ports:
      - "1025:1025"
      - "8025:8025"

volumes:
  database-data:
  backend-vendor:
  frontend-node-modules:
CODE,
    ],
    [
        'title' => 'SQLでウィンドウ関数を活用した分析クエリ',
        'language' => 'sql',
        'description' => 'ウィンドウ関数（SUM OVER, ROW_NUMBER, LAG）を組み合わせた実践的な分析クエリ。ユーザーごとの累計額・順位付け・前回との差分を一つのSELECTで算出する',
        'code' => <<<'CODE'
-- ユーザーごとの注文分析レポート
-- 累計金額・順位・前回注文からの日数差を算出する
WITH order_analysis AS (
    SELECT
        o.user_id,
        u.name AS user_name,
        o.id AS order_id,
        o.amount,
        o.created_at,
        -- 累計金額
        SUM(o.amount) OVER (
            PARTITION BY o.user_id
            ORDER BY o.created_at
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS cumulative_amount,
        -- ユーザー内での金額順位
        ROW_NUMBER() OVER (
            PARTITION BY o.user_id
            ORDER BY o.amount DESC
        ) AS amount_rank,
        -- 前回の注文日
        LAG(o.created_at) OVER (
            PARTITION BY o.user_id
            ORDER BY o.created_at
        ) AS previous_order_at,
        -- 注文件数
        COUNT(*) OVER (
            PARTITION BY o.user_id
        ) AS total_orders
    FROM orders o
    JOIN users u ON u.id = o.user_id
    WHERE o.created_at >= CURRENT_DATE - INTERVAL '90 days'
)
SELECT
    user_name,
    order_id,
    amount,
    cumulative_amount,
    amount_rank,
    total_orders,
    EXTRACT(DAY FROM created_at - previous_order_at) AS days_since_last_order
FROM order_analysis
ORDER BY user_name, created_at;
CODE,
    ],
    [
        'title' => 'JavaScriptでイベント駆動のPubSubパターン',
        'language' => 'javascript',
        'description' => 'コンポーネント間の疎結合な通信を実現するPublish/Subscribeパターンの実装。型安全なイベント登録・購読解除・ワイルドカード対応を含む軽量なイベントバスを構築する',
        'code' => <<<'CODE'
class EventBus {
  #subscribers = new Map();
  #onceFlags = new WeakSet();

  on(event, callback) {
    if (!this.#subscribers.has(event)) {
      this.#subscribers.set(event, new Set());
    }
    this.#subscribers.get(event).add(callback);

    // 購読解除関数を返す
    return () => this.off(event, callback);
  }

  once(event, callback) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      callback(...args);
    };
    this.#onceFlags.add(wrapper);
    return this.on(event, wrapper);
  }

  off(event, callback) {
    const subscribers = this.#subscribers.get(event);
    if (subscribers) {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        this.#subscribers.delete(event);
      }
    }
  }

  emit(event, ...args) {
    // 完全一致のリスナー
    const exact = this.#subscribers.get(event);
    if (exact) {
      exact.forEach((callback) => callback(...args));
    }

    // ワイルドカードリスナー
    const wildcard = this.#subscribers.get("*");
    if (wildcard) {
      wildcard.forEach((callback) => callback(event, ...args));
    }
  }

  clear(event) {
    if (event) {
      this.#subscribers.delete(event);
    } else {
      this.#subscribers.clear();
    }
  }

  get listenerCount() {
    let count = 0;
    this.#subscribers.forEach((set) => (count += set.size));
    return count;
  }
}

// 使用例
const bus = new EventBus();

const unsubscribe = bus.on("snippet:created", (snippet) => {
  console.log(`新しいスニペット: ${snippet.title}`);
});

bus.once("snippet:created", (snippet) => {
  console.log(`初回のみ通知: ${snippet.title}`);
});

bus.emit("snippet:created", { title: "Hello World", language: "javascript" });
bus.emit("snippet:created", { title: "Second", language: "python" });

unsubscribe();
CODE,
    ],
    [
        'title' => 'PHPでリポジトリパターンを実装する',
        'language' => 'php',
        'description' => 'Eloquentの直接利用をリポジトリ層で抽象化し、ドメインロジックとデータアクセスを分離する実装。検索条件の組み立て・ページネーション・キャッシュ制御をリポジトリに集約する',
        'code' => <<<'CODE'
<?php

namespace App\Repositories;

use App\Enums\Visibility;
use App\Models\Snippet;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class SnippetRepository
{
    public function __construct(
        private readonly Snippet $model,
    ) {}

    public function findBySlug(string $slug): ?Snippet
    {
        return $this->model
            ->with(['user', 'tags'])
            ->where('slug', $slug)
            ->first();
    }

    public function findPublicBySlug(string $slug): ?Snippet
    {
        return $this->model
            ->with(['user', 'tags'])
            ->where('slug', $slug)
            ->where('visibility', Visibility::Public)
            ->where(function (Builder $query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->first();
    }

    public function paginatePublic(
        ?string $keyword = null,
        ?string $language = null,
        ?string $tag = null,
        int $perPage = 24,
    ): LengthAwarePaginator {
        $query = $this->model
            ->with(['user', 'tags'])
            ->where('visibility', Visibility::Public)
            ->where(function (Builder $query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            });

        if ($keyword !== null) {
            $query->where(function (Builder $query) use ($keyword) {
                $query->where('title', 'ILIKE', "%{$keyword}%")
                      ->orWhere('code', 'ILIKE', "%{$keyword}%");
            });
        }

        if ($language !== null) {
            $query->where('language', $language);
        }

        if ($tag !== null) {
            $query->whereHas('tags', function (Builder $query) use ($tag) {
                $query->where('name', $tag);
            });
        }

        return $query->latest()->paginate($perPage);
    }
}
CODE,
    ],
    [
        'title' => 'TypeScriptでZodによるフォームバリデーション',
        'language' => 'typescript',
        'description' => 'Zodスキーマとreact-hook-formを組み合わせた型安全なフォームバリデーション。スキーマ定義から型を自動推論し、サーバー・クライアント両方で同じバリデーションルールを共有する',
        'code' => <<<'CODE'
import { z } from "zod";

const MAX_TITLE_LENGTH = 100;
const MAX_CODE_LENGTH = 10000;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 30;

const Languages = [
  "php",
  "javascript",
  "typescript",
  "python",
  "go",
  "rust",
  "ruby",
  "java",
] as const;

const Visibilities = ["public", "unlisted", "private"] as const;

export const SnippetFormSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(MAX_TITLE_LENGTH, `タイトルは${MAX_TITLE_LENGTH}文字以内です`),
  code: z
    .string()
    .min(1, "コードは必須です")
    .max(MAX_CODE_LENGTH, `コードは${MAX_CODE_LENGTH}文字以内です`),
  language: z.enum(Languages, {
    errorMap: () => ({ message: "言語を選択してください" }),
  }),
  description: z
    .string()
    .max(MAX_DESCRIPTION_LENGTH, `説明文は${MAX_DESCRIPTION_LENGTH}文字以内です`)
    .optional()
    .transform((val) => val || undefined),
  visibility: z.enum(Visibilities).default("unlisted"),
  tags: z
    .array(
      z.string().max(MAX_TAG_LENGTH, `タグは${MAX_TAG_LENGTH}文字以内です`),
    )
    .max(MAX_TAGS, `タグは${MAX_TAGS}個までです`)
    .default([]),
});

export type SnippetFormValues = z.infer<typeof SnippetFormSchema>;

// サーバーサイドでの使用例
export const validateSnippet = (data: unknown): SnippetFormValues => {
  return SnippetFormSchema.parse(data);
};
CODE,
    ],
    [
        'title' => 'CSSでレスポンシブなダッシュボードレイアウト',
        'language' => 'css',
        'description' => 'CSS Gridのauto-fitとminmaxを組み合わせたダッシュボードレイアウト。メディアクエリを使わずにコンテナのサイズに応じてカラム数が自動調整される',
        'code' => <<<'CODE'
/* ダッシュボードの全体レイアウト */
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar content";
  min-height: 100vh;
}

.dashboard-header {
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--color-edge);
  background-color: var(--color-surface-raised);
}

.dashboard-sidebar {
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;
  border-right: 1px solid var(--color-edge);
  background-color: var(--color-surface);
  overflow-y: auto;
}

.dashboard-content {
  grid-area: content;
  padding: 1.5rem;
  overflow-y: auto;
}

/* カードグリッド（auto-fitで自動レスポンシブ） */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border: 1px solid var(--color-edge);
  border-radius: 0.75rem;
  background-color: var(--color-surface-raised);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* SP: サイドバーを非表示にして1カラム */
@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "content";
  }

  .dashboard-sidebar {
    display: none;
  }
}
CODE,
    ],
    [
        'title' => 'BashでCI/CDパイプラインのヘルパースクリプト',
        'language' => 'bash',
        'description' => 'デプロイ前のチェックを自動化するシェルスクリプト。テスト実行・リント・ビルド・Docker イメージのタグ付けまでを一括で行い、いずれかのステップが失敗したら即座に中断する',
        'code' => <<<'CODE'
#!/bin/bash
set -euo pipefail

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 引数チェック
ENVIRONMENT="${1:?Usage: deploy.sh <environment> (staging|production)}"

if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
  log_error "無効な環境名: $ENVIRONMENT"
  exit 1
fi

# Git状態チェック
if [[ -n "$(git status --porcelain)" ]]; then
  log_error "コミットされていない変更があります"
  git status --short
  exit 1
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT=$(git rev-parse --short HEAD)
TAG="${ENVIRONMENT}-${COMMIT}-$(date +%Y%m%d%H%M%S)"

log_info "デプロイ開始: $ENVIRONMENT (branch: $BRANCH, commit: $COMMIT)"

# テスト実行
log_info "テストを実行中..."
docker compose exec -T backend php artisan test --parallel
docker compose exec -T frontend pnpm test

# リント
log_info "リントを実行中..."
docker compose exec -T backend ./vendor/bin/pint --test
docker compose exec -T frontend pnpm lint

# ビルド
log_info "Dockerイメージをビルド中..."
docker build -t "snipshare-backend:$TAG" ./backend
docker build -t "snipshare-frontend:$TAG" ./frontend

log_info "デプロイ準備完了: $TAG"
log_info "次のステップ: docker push snipshare-backend:$TAG"
CODE,
    ],
    [
        'title' => 'PythonでSQLAlchemyのモデル定義とCRUD操作',
        'language' => 'python',
        'description' => 'SQLAlchemy 2.0のDeclarative Mappingを使ったモデル定義。リレーション・インデックス・制約を含む実践的な構成と、非同期セッションでのCRUD操作パターンを示す',
        'code' => <<<'CODE'
from datetime import datetime
from sqlalchemy import String, Text, ForeignKey, Index, func
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    snippets: Mapped[list["Snippet"]] = relationship(back_populates="user")

    def __repr__(self) -> str:
        return f"User(id={self.id}, name={self.name!r})"


class Snippet(Base):
    __tablename__ = "snippets"
    __table_args__ = (
        Index("idx_snippets_public", "created_at", postgresql_where="visibility = 'public'"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    slug: Mapped[str] = mapped_column(String(16), unique=True)
    title: Mapped[str] = mapped_column(String(255))
    code: Mapped[str] = mapped_column(Text)
    language: Mapped[str] = mapped_column(String(50))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    visibility: Mapped[str] = mapped_column(String(10), default="unlisted")
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped[User] = relationship(back_populates="snippets")

    @property
    def is_public(self) -> bool:
        return self.visibility == "public"

    def __repr__(self) -> str:
        return f"Snippet(slug={self.slug!r}, title={self.title!r})"
CODE,
    ],
    [
        'title' => 'Goで並行処理とチャネルを活用するワーカープール',
        'language' => 'go',
        'description' => 'goroutineとチャネルを使ったワーカープールパターンの実装。固定数のワーカーがジョブキューからタスクを取り出し並行処理する、Goの並行プリミティブの典型的な活用例',
        'code' => <<<'CODE'
package main

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

type Job struct {
	ID      int
	Payload string
}

type Result struct {
	JobID    int
	Output   string
	Duration time.Duration
}

func worker(id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {
	defer wg.Done()

	for job := range jobs {
		start := time.Now()

		// 処理のシミュレーション
		duration := time.Duration(rand.Intn(500)) * time.Millisecond
		time.Sleep(duration)

		output := fmt.Sprintf("Worker %d processed job %d: %s", id, job.ID, job.Payload)

		results <- Result{
			JobID:    job.ID,
			Output:   output,
			Duration: time.Since(start),
		}
	}
}

func main() {
	const numWorkers = 5
	const numJobs = 20

	jobs := make(chan Job, numJobs)
	results := make(chan Result, numJobs)

	// ワーカーを起動
	var wg sync.WaitGroup
	for i := 1; i <= numWorkers; i++ {
		wg.Add(1)
		go worker(i, jobs, results, &wg)
	}

	// ジョブを投入
	for i := 1; i <= numJobs; i++ {
		jobs <- Job{ID: i, Payload: fmt.Sprintf("task-%d", i)}
	}
	close(jobs)

	// 結果収集用のgoroutine
	go func() {
		wg.Wait()
		close(results)
	}()

	// 結果を出力
	for result := range results {
		fmt.Printf("[Job %2d] %s (%v)\n", result.JobID, result.Output, result.Duration)
	}
}
CODE,
    ],
    [
        'title' => 'RustでOption/Resultのチェーンとエラーハンドリング',
        'language' => 'rust',
        'description' => 'Rustの?演算子とOption/Resultのコンビネータを使ったエラー処理パターン。thiserrorクレートでカスタムエラー型を定義し、関数間のエラー伝播を型安全に行う',
        'code' => <<<'CODE'
use std::collections::HashMap;
use std::fs;
use thiserror::Error;

#[derive(Error, Debug)]
enum ConfigError {
    #[error("設定ファイルの読み取りに失敗: {0}")]
    IoError(#[from] std::io::Error),

    #[error("設定の解析に失敗: {0}")]
    ParseError(String),

    #[error("必須フィールドが見つからない: {0}")]
    MissingField(String),

    #[error("無効な値: {field} = {value}")]
    InvalidValue { field: String, value: String },
}

#[derive(Debug)]
struct Config {
    host: String,
    port: u16,
    database_url: String,
    max_connections: u32,
}

fn parse_config_file(path: &str) -> Result<Config, ConfigError> {
    let content = fs::read_to_string(path)?;

    let entries: HashMap<String, String> = content
        .lines()
        .filter(|line| !line.starts_with('#') && !line.is_empty())
        .filter_map(|line| {
            let (key, value) = line.split_once('=')?;
            Some((key.trim().to_string(), value.trim().to_string()))
        })
        .collect();

    let host = entries
        .get("host")
        .cloned()
        .ok_or_else(|| ConfigError::MissingField("host".into()))?;

    let port = entries
        .get("port")
        .ok_or_else(|| ConfigError::MissingField("port".into()))?
        .parse::<u16>()
        .map_err(|_| ConfigError::InvalidValue {
            field: "port".into(),
            value: entries["port"].clone(),
        })?;

    let database_url = entries
        .get("database_url")
        .cloned()
        .ok_or_else(|| ConfigError::MissingField("database_url".into()))?;

    let max_connections = entries
        .get("max_connections")
        .map(|v| v.parse::<u32>())
        .transpose()
        .map_err(|_| ConfigError::ParseError("max_connections は数値である必要があります".into()))?
        .unwrap_or(10);

    Ok(Config {
        host,
        port,
        database_url,
        max_connections,
    })
}

fn main() {
    match parse_config_file("config.env") {
        Ok(config) => println!("設定を読み込みました: {config:?}"),
        Err(e) => eprintln!("エラー: {e}"),
    }
}
CODE,
    ],
    [
        'title' => 'LaravelでFormRequestとカスタムバリデーション',
        'language' => 'php',
        'description' => 'FormRequestを継承したバリデーションクラスに、カスタムルール・条件付きバリデーション・認可チェックを組み込んだ実装。コントローラからバリデーションロジックを完全に分離する',
        'code' => <<<'CODE'
<?php

namespace App\Http\Requests;

use App\Enums\Visibility;
use App\Rules\NoProfanity;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class StoreSnippetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:100',
                new NoProfanity(),
            ],
            'code' => [
                'required',
                'string',
                'max:10000',
            ],
            'language' => [
                'required',
                'string',
                Rule::in($this->supportedLanguages()),
            ],
            'description' => [
                'nullable',
                'string',
                'max:500',
            ],
            'visibility' => [
                'required',
                new Enum(Visibility::class),
            ],
            'expires_at' => [
                'nullable',
                'date',
                'after:now',
            ],
            'tags' => [
                'array',
                'max:5',
            ],
            'tags.*' => [
                'string',
                'max:30',
                'regex:/^[a-z0-9\-]+$/',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'タイトルを入力してください',
            'code.required' => 'コードを入力してください',
            'code.max' => 'コードは10,000文字以内で入力してください',
            'tags.max' => 'タグは5つまでです',
            'tags.*.regex' => 'タグは英小文字・数字・ハイフンのみ使用できます',
            'expires_at.after' => '有効期限は現在より後の日時を指定してください',
        ];
    }

    private function supportedLanguages(): array
    {
        return [
            'php', 'javascript', 'typescript', 'python', 'go',
            'rust', 'ruby', 'java', 'c', 'cpp', 'csharp',
            'swift', 'kotlin', 'html', 'css', 'sql', 'bash',
            'json', 'yaml', 'xml', 'markdown', 'plaintext',
        ];
    }
}
CODE,
    ],
    [
        'title' => 'ReactでSuspenseとErrorBoundaryを組み合わせる',
        'language' => 'typescript',
        'description' => 'データフェッチのローディング状態とエラー状態を宣言的に制御するパターン。Suspenseでスケルトン表示、ErrorBoundaryでフォールバックUIを提供し、try/catchの手続き的なエラー処理を排除する',
        'code' => <<<'CODE'
import { Component, Suspense, type ReactNode, type ErrorInfo } from "react";

type ErrorBoundaryProps = {
  fallback: (error: Error, reset: () => void) => ReactNode;
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return this.props.children;
  }
}

// スケルトンコンポーネント
const SnippetSkeleton = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    <div className="h-6 w-2/3 rounded bg-surface-hover" />
    <div className="h-48 rounded-lg bg-surface-hover" />
    <div className="h-4 w-full rounded bg-surface-hover" />
  </div>
);

// エラーフォールバック
const SnippetError = ({ error, reset }: { error: Error; reset: () => void }) => (
  <div className="flex flex-col items-center gap-4 py-12">
    <p className="text-ink-muted">読み込みに失敗しました: {error.message}</p>
    <button onClick={reset} className="rounded bg-accent px-4 py-2 text-surface">
      再試行
    </button>
  </div>
);

// ページコンポーネントでの使用
export const SnippetPage = () => (
  <ErrorBoundary fallback={(error, reset) => <SnippetError error={error} reset={reset} />}>
    <Suspense fallback={<SnippetSkeleton />}>
      <SnippetDetail />
    </Suspense>
  </ErrorBoundary>
);
CODE,
    ],
    [
        'title' => 'JSONでOpenAPIスキーマ定義',
        'language' => 'json',
        'description' => 'OpenAPI 3.0仕様に従ったAPIスキーマ定義。パス・パラメータ・レスポンススキーマ・エラーレスポンスを含む、実用的なAPI仕様書のJSON形式',
        'code' => <<<'CODE'
{
  "openapi": "3.0.3",
  "info": {
    "title": "SnipShare API",
    "version": "1.0.0",
    "description": "コードスニペット共有サービスのAPI"
  },
  "paths": {
    "/api/snippets": {
      "get": {
        "summary": "公開スニペット一覧を取得する",
        "parameters": [
          {
            "name": "keyword",
            "in": "query",
            "schema": { "type": "string" },
            "description": "タイトル・コードの検索キーワード"
          },
          {
            "name": "language",
            "in": "query",
            "schema": { "type": "string" },
            "description": "プログラミング言語でフィルタ"
          },
          {
            "name": "page",
            "in": "query",
            "schema": { "type": "integer", "default": 1 }
          },
          {
            "name": "per_page",
            "in": "query",
            "schema": { "type": "integer", "default": 24 }
          }
        ],
        "responses": {
          "200": {
            "description": "成功",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/Snippet" }
                    },
                    "meta": { "$ref": "#/components/schemas/PaginationMeta" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/snippets/{slug}": {
      "get": {
        "summary": "スニペットの詳細を取得する",
        "parameters": [
          {
            "name": "slug",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "成功",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": { "$ref": "#/components/schemas/Snippet" }
                  }
                }
              }
            }
          },
          "404": {
            "description": "スニペットが見つからない"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Snippet": {
        "type": "object",
        "properties": {
          "slug": { "type": "string" },
          "title": { "type": "string" },
          "code": { "type": "string" },
          "language": { "type": "string" },
          "description": { "type": "string", "nullable": true },
          "visibility": { "type": "string", "enum": ["public", "unlisted", "private"] },
          "tags": { "type": "array", "items": { "type": "string" } },
          "user": {
            "type": "object",
            "properties": {
              "name": { "type": "string" },
              "avatar_url": { "type": "string", "nullable": true }
            }
          },
          "created_at": { "type": "string", "format": "date-time" },
          "updated_at": { "type": "string", "format": "date-time" }
        }
      },
      "PaginationMeta": {
        "type": "object",
        "properties": {
          "current_page": { "type": "integer" },
          "last_page": { "type": "integer" },
          "per_page": { "type": "integer" },
          "total": { "type": "integer" }
        }
      }
    }
  }
}
CODE,
    ],
    [
        'title' => 'HTMLでWAI-ARIAを使ったアクセシブルなタブUI',
        'language' => 'html',
        'description' => 'WAI-ARIAのtablistロールパターンに従ったタブUIのマークアップ。キーボードナビゲーション対応のaria属性・tabindex管理・フォーカス制御を含む、スクリーンリーダー対応のセマンティックな構造',
        'code' => <<<'CODE'
<!-- タブリスト -->
<div class="tabs">
  <div role="tablist" aria-label="スニペット情報">
    <button
      role="tab"
      id="tab-code"
      aria-controls="panel-code"
      aria-selected="true"
      tabindex="0"
    >
      コード
    </button>
    <button
      role="tab"
      id="tab-readme"
      aria-controls="panel-readme"
      aria-selected="false"
      tabindex="-1"
    >
      README
    </button>
    <button
      role="tab"
      id="tab-history"
      aria-controls="panel-history"
      aria-selected="false"
      tabindex="-1"
    >
      変更履歴
    </button>
  </div>

  <!-- タブパネル: コード -->
  <div
    role="tabpanel"
    id="panel-code"
    aria-labelledby="tab-code"
    tabindex="0"
  >
    <pre><code>import { useState } from 'react';

export const useCounter = (initial = 0) => {
  const [count, setCount] = useState(initial);
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(initial);
  return { count, increment, decrement, reset };
};</code></pre>
  </div>

  <!-- タブパネル: README（非表示） -->
  <div
    role="tabpanel"
    id="panel-readme"
    aria-labelledby="tab-readme"
    tabindex="0"
    hidden
  >
    <article>
      <h2>useCounter</h2>
      <p>シンプルなカウンター状態を管理するカスタムフック</p>
      <h3>使い方</h3>
      <pre><code>const { count, increment } = useCounter(0);</code></pre>
      <h3>API</h3>
      <dl>
        <dt><code>count</code></dt>
        <dd>現在のカウント値</dd>
        <dt><code>increment()</code></dt>
        <dd>カウントを1増やす</dd>
        <dt><code>decrement()</code></dt>
        <dd>カウントを1減らす</dd>
        <dt><code>reset()</code></dt>
        <dd>初期値にリセットする</dd>
      </dl>
    </article>
  </div>

  <!-- タブパネル: 変更履歴（非表示） -->
  <div
    role="tabpanel"
    id="panel-history"
    aria-labelledby="tab-history"
    tabindex="0"
    hidden
  >
    <ol reversed>
      <li>
        <time datetime="2026-03-17">2026-03-17</time>
        — reset関数を追加
      </li>
      <li>
        <time datetime="2026-03-15">2026-03-15</time>
        — 初期値パラメータを追加
      </li>
      <li>
        <time datetime="2026-03-10">2026-03-10</time>
        — 初期実装
      </li>
    </ol>
  </div>
</div>
CODE,
    ],
    [
        'title' => 'JavaScriptでPromise並行制御ユーティリティ',
        'language' => 'javascript',
        'description' => 'Promise.allの同時実行数を制限するpMapの実装。大量のAPI呼び出しやファイル処理でサーバーに過負荷をかけずに並行処理するための汎用ユーティリティ',
        'code' => <<<'CODE'
/**
 * 並行数を制限しながらPromiseを実行する
 * Promise.allと違い、同時に実行されるPromiseの数を制御できる
 */
const pMap = async (items, mapper, { concurrency = 5 } = {}) => {
  const results = new Array(items.length);
  let currentIndex = 0;

  const runNext = async () => {
    while (currentIndex < items.length) {
      const index = currentIndex++;
      try {
        results[index] = await mapper(items[index], index);
      } catch (error) {
        results[index] = { error, index };
        // エラーでも続行する（Promise.allSettled的な挙動）
      }
    }
  };

  // concurrency分のワーカーを起動
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => runNext()
  );

  await Promise.all(workers);
  return results;
};

/**
 * リトライ付きのfetchラッパー
 */
const fetchWithRetry = async (url, { maxRetries = 3, delay = 1000 } = {}) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }
};

// 使用例: 100件のURLを同時5件ずつフェッチ
const urls = Array.from({ length: 100 }, (_, i) => `https://api.example.com/items/${i}`);

const results = await pMap(
  urls,
  (url) => fetchWithRetry(url, { maxRetries: 2 }),
  { concurrency: 5 }
);

console.log(`成功: ${results.filter((r) => !r?.error).length}件`);
console.log(`失敗: ${results.filter((r) => r?.error).length}件`);
CODE,
    ],
    [
        'title' => 'PHPでDTOとUseCaseパターン',
        'language' => 'php',
        'description' => 'readonlyクラスを使ったDTOとUseCaseパターンの実装。コントローラからビジネスロジックを分離し、テスタビリティと再利用性を高める設計。トランザクション制御もUseCase内に閉じ込める',
        'code' => <<<'CODE'
<?php

namespace App\UseCases\Snippet;

use App\Enums\Visibility;
use App\Models\Snippet;
use App\Models\Tag;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

readonly class CreateSnippetInput
{
    /**
     * @param string[] $tags
     */
    public function __construct(
        public int $userId,
        public string $title,
        public string $code,
        public string $language,
        public ?string $description,
        public Visibility $visibility,
        public ?string $expiresAt,
        public array $tags,
    ) {}
}

readonly class CreateSnippetOutput
{
    public function __construct(
        public string $slug,
        public string $title,
    ) {}
}

class CreateSnippetUseCase
{
    public function execute(CreateSnippetInput $input): CreateSnippetOutput
    {
        return DB::transaction(function () use ($input) {
            $snippet = Snippet::create([
                'user_id' => $input->userId,
                'slug' => Str::random(8),
                'title' => $input->title,
                'code' => $input->code,
                'language' => $input->language,
                'description' => $input->description,
                'visibility' => $input->visibility,
                'expires_at' => $input->expiresAt,
            ]);

            if (count($input->tags) > 0) {
                $tagIds = collect($input->tags)->map(function (string $name) {
                    return Tag::firstOrCreate(['name' => $name])->id;
                });

                $snippet->tags()->attach($tagIds);
            }

            return new CreateSnippetOutput(
                slug: $snippet->slug,
                title: $snippet->title,
            );
        });
    }
}
CODE,
    ],
    [
        'title' => 'Markdownでアーキテクチャ決定記録(ADR)',
        'language' => 'markdown',
        'description' => 'Architecture Decision Record（ADR）のテンプレート。技術選定やアーキテクチャ判断の背景・選択肢・結論を構造化して記録し、将来の開発者が「なぜこの設計なのか」を理解できるようにする',
        'code' => <<<'CODE'
# ADR-001: フロントエンドの状態管理にZustandを採用する

## ステータス

承認済み (2026-03-15)

## コンテキスト

SnipShareのフロントエンドでは、認証状態・テーマ設定・フォーム状態など
複数のグローバル状態を管理する必要がある。

React 19のServer Componentsを採用しているため、
クライアント状態の管理範囲は限定的だが、
以下のケースでクライアント側の状態管理が必要:

- 認証セッション情報（ログイン状態、ユーザー情報）
- テーマカラーの切り替え
- モーダル/オーバーレイの開閉状態
- フォームの一時的な入力状態

## 検討した選択肢

### 1. React Context + useReducer
- **利点**: 追加依存なし、React標準
- **欠点**: Provider地獄、再レンダリング最適化が手動、ボイラープレート多い

### 2. Zustand
- **利点**: 軽量(1.2kB)、Providerレス、セレクタで再レンダリング最適化、SSR対応
- **欠点**: 外部依存が増える

### 3. Jotai
- **利点**: アトミックな状態管理、React Suspense統合
- **欠点**: 学習コスト、大きな状態の管理が冗長

## 決定

**Zustand**を採用する。

## 根拠

- Server Components中心の設計でクライアント状態は限定的なため、軽量さを重視
- Providerを使わないため、Server/Client境界を跨ぐ際の制約が少ない
- セレクタベースの購読で不要な再レンダリングを自動回避
- APIがシンプルでボイラープレートが少なく、チーム全体で扱いやすい

## 影響

- `foundations/hooks/` にストア定義を配置する
- 1ストア1ファイルを原則とし、肥大化を防ぐ
- Server Componentsからストアを直接参照しない
CODE,
    ],
    [
        'title' => 'TypeScriptでジェネリクスを活用したAPI型定義',
        'language' => 'typescript',
        'description' => 'APIレスポンスの型をジェネリクスで抽象化し、エンドポイントごとに型安全なfetchラッパーを構築するパターン。Zodスキーマとの統合でランタイムバリデーションも同時に行う',
        'code' => <<<'CODE'
import { z } from "zod";

// ページネーションメタ
const PaginationMeta = z.object({
  current_page: z.number(),
  last_page: z.number(),
  per_page: z.number(),
  total: z.number(),
});

// ページネーション付きレスポンスのファクトリ
const withPagination = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    meta: PaginationMeta,
  });

// 単一リソースレスポンスのファクトリ
const withData = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
  });

// スニペットスキーマ
const Snippet = z.object({
  slug: z.string(),
  title: z.string(),
  code: z.string(),
  language: z.string(),
  description: z.nullable(z.string()),
  visibility: z.enum(["public", "unlisted", "private"]),
  tags: z.array(z.string()),
  user: z.object({
    name: z.string(),
    avatar_url: z.nullish(z.string()),
  }),
  created_at: z.string(),
  updated_at: z.string(),
});

type Snippet = z.infer<typeof Snippet>;

// エンドポイント定義
const Endpoints = {
  snippets: {
    path: "/api/snippets",
    schema: withPagination(z.array(Snippet)),
  },
  snippet: (slug: string) => ({
    path: `/api/snippets/${slug}`,
    schema: withData(Snippet),
  }),
} as const;

// 型安全なfetch
const apiFetch = async <T extends z.ZodType>(
  endpoint: { path: string; schema: T },
  options?: RequestInit,
): Promise<z.infer<T>> => {
  const response = await fetch(endpoint.path, {
    headers: { Accept: "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const json = await response.json();
  return endpoint.schema.parse(json);
};

// 使用例
const listSnippets = () => apiFetch(Endpoints.snippets);
const getSnippet = (slug: string) => apiFetch(Endpoints.snippet(slug));
CODE,
    ],
    [
        'title' => 'Pythonでデコレータを組み合わせた関数拡張',
        'language' => 'python',
        'description' => 'リトライ・タイムアウト・ロギング・キャッシュなど、複数のデコレータを組み合わせて関数の横断的関心事を宣言的に付与するパターン。functools.wrapsで関数メタデータを保持する',
        'code' => <<<'CODE'
import functools
import logging
import time
from typing import Callable, ParamSpec, TypeVar

P = ParamSpec("P")
R = TypeVar("R")

logger = logging.getLogger(__name__)


def retry(max_attempts: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """リトライデコレータ（指数バックオフ対応）"""

    def decorator(func: Callable[P, R]) -> Callable[P, R]:
        @functools.wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
            current_delay = delay
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts:
                        logger.error(f"{func.__name__} が {max_attempts} 回失敗: {e}")
                        raise
                    logger.warning(
                        f"{func.__name__} 試行 {attempt}/{max_attempts} 失敗, "
                        f"{current_delay:.1f}秒後にリトライ: {e}"
                    )
                    time.sleep(current_delay)
                    current_delay *= backoff
            raise RuntimeError("到達不能")

        return wrapper

    return decorator


def timer(func: Callable[P, R]) -> Callable[P, R]:
    """実行時間計測デコレータ"""

    @functools.wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        start = time.perf_counter()
        try:
            result = func(*args, **kwargs)
            return result
        finally:
            elapsed = time.perf_counter() - start
            logger.info(f"{func.__name__} 実行時間: {elapsed:.3f}秒")

    return wrapper


def cache(ttl: float = 300.0):
    """TTL付きキャッシュデコレータ"""

    def decorator(func: Callable[P, R]) -> Callable[P, R]:
        _cache: dict[str, tuple[float, R]] = {}

        @functools.wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
            key = str((args, sorted(kwargs.items())))
            now = time.time()

            if key in _cache:
                cached_time, cached_value = _cache[key]
                if now - cached_time < ttl:
                    logger.debug(f"{func.__name__} キャッシュヒット")
                    return cached_value

            result = func(*args, **kwargs)
            _cache[key] = (now, result)
            return result

        wrapper.clear_cache = lambda: _cache.clear()
        return wrapper

    return decorator


# 組み合わせて使用
@timer
@retry(max_attempts=3, delay=0.5)
@cache(ttl=60.0)
def fetch_snippet(slug: str) -> dict:
    """APIからスニペットを取得する"""
    import httpx

    response = httpx.get(f"https://api.example.com/snippets/{slug}")
    response.raise_for_status()
    return response.json()
CODE,
    ],
    [
        'title' => 'CSSでスムーズなページ遷移アニメーション',
        'language' => 'css',
        'description' => 'View Transitions APIとCSS animationを組み合わせたページ遷移。クロスフェード・スライド・共有要素アニメーションの3パターンを実装し、SPAライクな体験をMPAでも実現する',
        'code' => <<<'CODE'
/* View Transitions APIのデフォルトアニメーションをカスタマイズ */

/* クロスフェード（デフォルト挙動の調整） */
::view-transition-old(root) {
  animation: fade-out 0.2s ease-out forwards;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-in forwards;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* スライドアニメーション（ページ遷移方向に応じて切替） */
::view-transition-old(slide) {
  animation: slide-out-left 0.3s ease-in-out forwards;
}

::view-transition-new(slide) {
  animation: slide-in-right 0.3s ease-in-out forwards;
}

@keyframes slide-out-left {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(-30px); opacity: 0; }
}

@keyframes slide-in-right {
  from { transform: translateX(30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* 共有要素アニメーション（カード→詳細画面のモーフィング） */
.snippet-card {
  view-transition-name: snippet-card;
}

.snippet-detail {
  view-transition-name: snippet-card;
}

::view-transition-group(snippet-card) {
  animation-duration: 0.35s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* reduced-motion対応 */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: 0.01ms !important;
  }

  ::view-transition-group(*) {
    animation-duration: 0.01ms !important;
  }
}
CODE,
    ],
    [
        'title' => 'GoでgRPCサーバーとクライアントを実装する',
        'language' => 'go',
        'description' => 'Protocol Buffersでサービスを定義し、gRPCのUnary RPCとServer Streaming RPCを実装する例。インターセプタでロギングを挟み、gRPCの基本パターンを網羅する',
        'code' => <<<'CODE'
package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Snippet はスニペット情報を表す
type Snippet struct {
	Slug     string
	Title    string
	Code     string
	Language string
}

// SnippetService はスニペットサービスの実装
type SnippetService struct {
	snippets map[string]*Snippet
}

func NewSnippetService() *SnippetService {
	return &SnippetService{
		snippets: map[string]*Snippet{
			"abc123": {
				Slug:     "abc123",
				Title:    "Hello World",
				Code:     "fmt.Println(\"Hello, World!\")",
				Language: "go",
			},
		},
	}
}

// GetSnippet はslugでスニペットを取得する（Unary RPC）
func (s *SnippetService) GetSnippet(ctx context.Context, slug string) (*Snippet, error) {
	snippet, ok := s.snippets[slug]
	if !ok {
		return nil, status.Errorf(codes.NotFound, "snippet not found: %s", slug)
	}
	return snippet, nil
}

// ロギングインターセプタ
func loggingInterceptor(
	ctx context.Context,
	req interface{},
	info *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (interface{}, error) {
	start := time.Now()
	resp, err := handler(ctx, req)
	duration := time.Since(start)

	if err != nil {
		log.Printf("[gRPC] %s ERROR %v (%v)", info.FullMethod, err, duration)
	} else {
		log.Printf("[gRPC] %s OK (%v)", info.FullMethod, duration)
	}

	return resp, err
}

func main() {
	listener, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	server := grpc.NewServer(
		grpc.UnaryInterceptor(loggingInterceptor),
	)

	// サービスを登録（実際にはprotocで生成されたコードを使う）
	_ = NewSnippetService()

	fmt.Println("gRPC server starting on :50051")
	if err := server.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
CODE,
    ],
    [
        'title' => 'PHPでEnum活用とパターンマッチング',
        'language' => 'php',
        'description' => 'PHP 8.1のEnumとmatch式を組み合わせた実装。Backed Enumにメソッドを生やして振る舞いを持たせ、条件分岐をEnum自身に閉じ込めることで、switch文の散在を防ぐ',
        'code' => <<<'CODE'
<?php

namespace App\Enums;

enum Visibility: string
{
    case Public = 'public';
    case Unlisted = 'unlisted';
    case Private = 'private';

    /**
     * UIに表示するラベルを返す
     */
    public function label(): string
    {
        return match ($this) {
            self::Public => '公開',
            self::Unlisted => '限定公開',
            self::Private => '非公開',
        };
    }

    /**
     * UIに表示する説明文を返す
     */
    public function description(): string
    {
        return match ($this) {
            self::Public => '誰でも閲覧・検索できます',
            self::Unlisted => 'URLを知っている人だけが閲覧できます',
            self::Private => '自分だけが閲覧できます',
        };
    }

    /**
     * バッジのカラークラスを返す
     */
    public function colorClass(): string
    {
        return match ($this) {
            self::Public => 'bg-green-100 text-green-800',
            self::Unlisted => 'bg-yellow-100 text-yellow-800',
            self::Private => 'bg-red-100 text-red-800',
        };
    }

    /**
     * 検索可能なvisibilityの一覧を返す
     *
     * @return self[]
     */
    public static function searchable(): array
    {
        return [self::Public];
    }

    /**
     * URLでアクセス可能なvisibilityの一覧を返す
     *
     * @return self[]
     */
    public static function accessible(): array
    {
        return [self::Public, self::Unlisted];
    }

    /**
     * フォームの選択肢として使える配列を返す
     *
     * @return array<string, string>
     */
    public static function options(): array
    {
        return array_combine(
            array_column(self::cases(), 'value'),
            array_map(fn (self $case) => $case->label(), self::cases()),
        );
    }
}
CODE,
    ],
    [
        'title' => 'TypeScriptでZustandの高度なストアパターン',
        'language' => 'typescript',
        'description' => 'Zustandのスライスパターンでストアを分割し、devtoolsミドルウェア・persist・immerを組み合わせた実践的な構成。大規模アプリでもストアの肥大化を防ぐ設計',
        'code' => <<<'CODE'
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// セッションスライス
type SessionSlice = {
  user: { name: string; avatarUrl: string | null } | null;
  isAuthenticated: boolean;
  setUser: (user: SessionSlice["user"]) => void;
  clearSession: () => void;
};

const createSessionSlice = (
  set: (fn: (state: SessionSlice) => void) => void,
): SessionSlice => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) =>
    set((state) => {
      state.user = user;
      state.isAuthenticated = user !== null;
    }),
  clearSession: () =>
    set((state) => {
      state.user = null;
      state.isAuthenticated = false;
    }),
});

// テーマスライス
type ThemeSlice = {
  themeId: string;
  setThemeId: (id: string) => void;
};

const createThemeSlice = (
  set: (fn: (state: ThemeSlice) => void) => void,
): ThemeSlice => ({
  themeId: "github-light",
  setThemeId: (id) =>
    set((state) => {
      state.themeId = id;
    }),
});

// オーバーレイスライス
type OverlaySlice = {
  isLoginOverlayOpen: boolean;
  openLoginOverlay: () => void;
  closeLoginOverlay: () => void;
};

const createOverlaySlice = (
  set: (fn: (state: OverlaySlice) => void) => void,
): OverlaySlice => ({
  isLoginOverlayOpen: false,
  openLoginOverlay: () =>
    set((state) => {
      state.isLoginOverlayOpen = true;
    }),
  closeLoginOverlay: () =>
    set((state) => {
      state.isLoginOverlayOpen = false;
    }),
});

// ストアを合成
type AppStore = SessionSlice & ThemeSlice & OverlaySlice;

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...createSessionSlice(set),
        ...createThemeSlice(set),
        ...createOverlaySlice(set),
      })),
      {
        name: "snipshare-store",
        partialize: (state) => ({
          themeId: state.themeId,
        }),
      },
    ),
  ),
);
CODE,
    ],
    [
        'title' => 'SQLでマテリアライズドビューとインデックス最適化',
        'language' => 'sql',
        'description' => 'PostgreSQLのマテリアライズドビューを使ったクエリ最適化。頻繁にアクセスされる集計結果を事前計算し、定期リフレッシュで鮮度を保つ戦略',
        'code' => <<<'CODE'
-- 言語別・月別のスニペット統計マテリアライズドビュー
CREATE MATERIALIZED VIEW snippet_monthly_stats AS
SELECT
    language,
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS snippet_count,
    COUNT(DISTINCT user_id) AS unique_authors,
    AVG(LENGTH(code)) AS avg_code_length,
    MAX(created_at) AS latest_created_at
FROM snippets
WHERE visibility = 'public'
    AND (expires_at IS NULL OR expires_at > NOW())
GROUP BY language, DATE_TRUNC('month', created_at)
WITH DATA;

-- ビューにインデックスを追加（検索の高速化）
CREATE UNIQUE INDEX idx_snippet_stats_language_month
    ON snippet_monthly_stats (language, month);

CREATE INDEX idx_snippet_stats_month
    ON snippet_monthly_stats (month DESC);

-- 人気タグのマテリアライズドビュー
CREATE MATERIALIZED VIEW popular_tags AS
SELECT
    t.name AS tag_name,
    COUNT(st.snippet_id) AS usage_count,
    COUNT(DISTINCT s.user_id) AS unique_users,
    MAX(s.created_at) AS last_used_at
FROM tags t
JOIN snippet_tag st ON st.tag_id = t.id
JOIN snippets s ON s.id = st.snippet_id
WHERE s.visibility = 'public'
    AND (s.expires_at IS NULL OR s.expires_at > NOW())
GROUP BY t.id, t.name
HAVING COUNT(st.snippet_id) >= 3
WITH DATA;

CREATE UNIQUE INDEX idx_popular_tags_name
    ON popular_tags (tag_name);

CREATE INDEX idx_popular_tags_usage
    ON popular_tags (usage_count DESC);

-- リフレッシュ（cronやLaravelのスケジューラで定期実行）
REFRESH MATERIALIZED VIEW CONCURRENTLY snippet_monthly_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY popular_tags;

-- 活用例: 言語別ランキング
SELECT
    language,
    SUM(snippet_count) AS total_snippets,
    SUM(unique_authors) AS total_authors,
    ROUND(AVG(avg_code_length)) AS avg_code_length
FROM snippet_monthly_stats
WHERE month >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
GROUP BY language
ORDER BY total_snippets DESC
LIMIT 10;
CODE,
    ],
    [
        'title' => 'Pythonでasyncioとaiohttpを使った非同期スクレイピング',
        'language' => 'python',
        'description' => 'asyncioのセマフォで並行数を制御しながらWebページを非同期にスクレイピングする実装。エラーハンドリング・リトライ・レート制限・結果の集約を含む実用的なパターン',
        'code' => <<<'CODE'
import asyncio
import logging
from dataclasses import dataclass, field
from datetime import datetime

import aiohttp
from aiohttp import ClientTimeout

logger = logging.getLogger(__name__)

MAX_CONCURRENCY = 10
REQUEST_TIMEOUT = 30
MAX_RETRIES = 3
RETRY_DELAY = 1.0


@dataclass
class FetchResult:
    url: str
    status: int | None = None
    content: str | None = None
    error: str | None = None
    duration: float = 0.0
    retries: int = 0


@dataclass
class BatchResult:
    results: list[FetchResult] = field(default_factory=list)
    started_at: datetime = field(default_factory=datetime.now)

    @property
    def succeeded(self) -> list[FetchResult]:
        return [r for r in self.results if r.error is None]

    @property
    def failed(self) -> list[FetchResult]:
        return [r for r in self.results if r.error is not None]

    def summary(self) -> str:
        elapsed = (datetime.now() - self.started_at).total_seconds()
        return (
            f"完了: {len(self.results)}件 "
            f"(成功: {len(self.succeeded)}, 失敗: {len(self.failed)}) "
            f"所要時間: {elapsed:.1f}秒"
        )


async def fetch_url(
    session: aiohttp.ClientSession,
    url: str,
    semaphore: asyncio.Semaphore,
) -> FetchResult:
    """単一URLをフェッチする（リトライ付き）"""
    result = FetchResult(url=url)
    start = asyncio.get_event_loop().time()

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            async with semaphore:
                async with session.get(url) as response:
                    result.status = response.status
                    result.content = await response.text()
                    result.duration = asyncio.get_event_loop().time() - start
                    result.retries = attempt - 1

                    if response.status >= 400:
                        result.error = f"HTTP {response.status}"
                    return result

        except asyncio.TimeoutError:
            result.error = "タイムアウト"
        except aiohttp.ClientError as e:
            result.error = str(e)

        if attempt < MAX_RETRIES:
            delay = RETRY_DELAY * (2 ** (attempt - 1))
            logger.warning(f"リトライ {attempt}/{MAX_RETRIES}: {url} ({delay}秒後)")
            await asyncio.sleep(delay)

    result.duration = asyncio.get_event_loop().time() - start
    result.retries = MAX_RETRIES
    return result


async def fetch_all(urls: list[str]) -> BatchResult:
    """複数URLを並行フェッチする"""
    semaphore = asyncio.Semaphore(MAX_CONCURRENCY)
    timeout = ClientTimeout(total=REQUEST_TIMEOUT)
    batch = BatchResult()

    async with aiohttp.ClientSession(timeout=timeout) as session:
        tasks = [fetch_url(session, url, semaphore) for url in urls]
        batch.results = await asyncio.gather(*tasks)

    logger.info(batch.summary())
    return batch


if __name__ == "__main__":
    urls = [f"https://httpbin.org/delay/{i % 3}" for i in range(30)]
    result = asyncio.run(fetch_all(urls))
    print(result.summary())
CODE,
    ],
    [
        'title' => 'RustでSerdeを使ったJSON処理',
        'language' => 'rust',
        'description' => 'serdeクレートによる構造体のシリアライズ/デシリアライズ。カスタムシリアライザ・デフォルト値・フィールドリネーム・バリデーションを含む実践的なJSON処理パターン',
        'code' => <<<'CODE'
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
enum Visibility {
    Public,
    Unlisted,
    Private,
}

#[derive(Debug, Serialize, Deserialize)]
struct User {
    name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    avatar_url: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Snippet {
    slug: String,
    title: String,
    code: String,
    language: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    description: Option<String>,
    visibility: Visibility,
    #[serde(default)]
    tags: Vec<String>,
    user: User,
    #[serde(skip_serializing_if = "Option::is_none")]
    expires_at: Option<DateTime<Utc>>,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
struct ApiResponse<T> {
    data: T,
}

#[derive(Debug, Serialize, Deserialize)]
struct PaginatedResponse<T> {
    data: T,
    meta: PaginationMeta,
}

#[derive(Debug, Serialize, Deserialize)]
struct PaginationMeta {
    current_page: u32,
    last_page: u32,
    per_page: u32,
    total: u32,
}

impl Snippet {
    fn is_expired(&self) -> bool {
        self.expires_at
            .map(|exp| exp < Utc::now())
            .unwrap_or(false)
    }

    fn code_line_count(&self) -> usize {
        self.code.lines().count()
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let json = r#"{
        "data": {
            "slug": "abc12345",
            "title": "Hello Rust",
            "code": "fn main() {\n    println!(\"Hello!\");\n}",
            "language": "rust",
            "description": "Rustの基本的なHello World",
            "visibility": "public",
            "tags": ["rust", "beginner"],
            "user": {
                "name": "rustacean",
                "avatar_url": null
            },
            "expires_at": null,
            "created_at": "2026-03-17T10:00:00Z",
            "updated_at": "2026-03-17T10:00:00Z"
        }
    }"#;

    let response: ApiResponse<Snippet> = serde_json::from_str(json)?;
    let snippet = &response.data;

    println!("タイトル: {}", snippet.title);
    println!("言語: {}", snippet.language);
    println!("行数: {}", snippet.code_line_count());
    println!("期限切れ: {}", snippet.is_expired());
    println!("タグ: {:?}", snippet.tags);

    // JSON出力
    let output = serde_json::to_string_pretty(&response)?;
    println!("\n{output}");

    Ok(())
}
CODE,
    ],
    [
        'title' => 'XMLでSVGアニメーションを定義する',
        'language' => 'xml',
        'description' => 'SVGのSMILアニメーションとCSS animationを組み合わせたローディングスピナーの実装。アクセシビリティ対応のaria属性とprefers-reduced-motion対応を含む',
        'visibility' => 'unlisted',
        'code' => <<<'CODE'
<?xml version="1.0" encoding="UTF-8"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 100 100"
  width="48"
  height="48"
  role="img"
  aria-label="読み込み中"
>
  <title>読み込み中</title>
  <desc>コンテンツを読み込んでいることを示すアニメーション</desc>

  <style>
    @media (prefers-reduced-motion: reduce) {
      .spinner { animation: none !important; }
      .dot { animation: none !important; opacity: 0.5; }
    }

    .spinner {
      transform-origin: 50px 50px;
      animation: rotate 1.4s linear infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .dot {
      animation: pulse 1.4s ease-in-out infinite;
    }

    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes pulse {
      0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
      40% { opacity: 1; transform: scale(1); }
    }
  </style>

  <!-- 回転する円弧 -->
  <g class="spinner">
    <circle
      cx="50" cy="50" r="40"
      fill="none"
      stroke="currentColor"
      stroke-width="4"
      stroke-linecap="round"
      stroke-dasharray="80 200"
      opacity="0.3"
    />
    <circle
      cx="50" cy="50" r="40"
      fill="none"
      stroke="currentColor"
      stroke-width="4"
      stroke-linecap="round"
      stroke-dasharray="80 200"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 50 50"
        to="360 50 50"
        dur="1.4s"
        repeatCount="indefinite"
      />
    </circle>
  </g>

  <!-- パルスするドット -->
  <g transform="translate(50, 50)">
    <circle class="dot" cx="-15" cy="0" r="4" fill="currentColor" />
    <circle class="dot" cx="0" cy="0" r="4" fill="currentColor" />
    <circle class="dot" cx="15" cy="0" r="4" fill="currentColor" />
  </g>
</svg>
CODE,
    ],
    [
        'title' => 'BashでGitワークフロー自動化スクリプト',
        'language' => 'bash',
        'description' => 'feature branch作成からPR作成までのGitワークフローを自動化するスクリプト。ブランチ命名規則の強制・コミットメッセージの検証・差分確認・GitHub CLIでのPR作成を一括で行う',
        'visibility' => 'unlisted',
        'code' => <<<'CODE'
#!/bin/bash
set -euo pipefail

# カラー出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

# コマンド存在チェック
require_command() {
  if ! command -v "$1" &> /dev/null; then
    error "$1 がインストールされていません"
    exit 1
  fi
}

require_command git
require_command gh

# 引数パース
ACTION="${1:-help}"
BRANCH_PREFIX="${2:-feature}"
BRANCH_NAME="${3:-}"

case "$ACTION" in
  start)
    # 新しいfeature branchを作成
    if [[ -z "$BRANCH_NAME" ]]; then
      error "ブランチ名を指定してください: git-flow.sh start feature my-feature"
      exit 1
    fi

    # ブランチ名のバリデーション
    if [[ ! "$BRANCH_NAME" =~ ^[a-z0-9\-]+$ ]]; then
      error "ブランチ名は英小文字・数字・ハイフンのみ使用できます"
      exit 1
    fi

    FULL_BRANCH="${BRANCH_PREFIX}/${BRANCH_NAME}"
    info "ブランチを作成: $FULL_BRANCH"

    git checkout main
    git pull origin main
    git checkout -b "$FULL_BRANCH"
    success "ブランチ $FULL_BRANCH を作成しました"
    ;;

  pr)
    # PRを作成
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

    if [[ "$CURRENT_BRANCH" == "main" ]]; then
      error "mainブランチからPRは作成できません"
      exit 1
    fi

    # 未コミットの変更チェック
    if [[ -n "$(git status --porcelain)" ]]; then
      warn "コミットされていない変更があります:"
      git status --short
      read -rp "続行しますか? (y/N): " confirm
      [[ "$confirm" != "y" ]] && exit 0
    fi

    # pushしてPR作成
    info "リモートにpush中..."
    git push -u origin "$CURRENT_BRANCH"

    info "PRを作成中..."
    gh pr create --fill --web
    success "PRを作成しました"
    ;;

  status)
    # 現在のブランチ状態を表示
    echo ""
    info "現在のブランチ: $(git rev-parse --abbrev-ref HEAD)"
    info "mainとの差分:"
    echo ""
    git log --oneline main..HEAD
    echo ""
    info "変更ファイル:"
    git diff --stat main..HEAD
    ;;

  *)
    echo "Usage: git-flow.sh <command> [options]"
    echo ""
    echo "Commands:"
    echo "  start <prefix> <name>  新しいブランチを作成する"
    echo "  pr                     PRを作成する"
    echo "  status                 ブランチの状態を表示する"
    ;;
esac
CODE,
    ],
    [
        'title' => 'Goでジェネリクスとインターフェースを活用する',
        'language' => 'go',
        'description' => 'Go 1.18以降のジェネリクスを使った汎用コレクションユーティリティの実装。Map・Filter・Reduce・GroupByなど、スライス操作を型安全に抽象化する',
        'visibility' => 'unlisted',
        'code' => <<<'CODE'
package collections

import "cmp"

// Map はスライスの各要素に関数を適用した新しいスライスを返す
func Map[T any, U any](slice []T, fn func(T) U) []U {
	result := make([]U, len(slice))
	for i, v := range slice {
		result[i] = fn(v)
	}
	return result
}

// Filter は条件を満たす要素だけを含む新しいスライスを返す
func Filter[T any](slice []T, predicate func(T) bool) []T {
	var result []T
	for _, v := range slice {
		if predicate(v) {
			result = append(result, v)
		}
	}
	return result
}

// Reduce はスライスを単一の値に畳み込む
func Reduce[T any, U any](slice []T, initial U, fn func(U, T) U) U {
	acc := initial
	for _, v := range slice {
		acc = fn(acc, v)
	}
	return acc
}

// GroupBy は関数の戻り値をキーにしてスライスをグルーピングする
func GroupBy[T any, K comparable](slice []T, keyFn func(T) K) map[K][]T {
	result := make(map[K][]T)
	for _, v := range slice {
		key := keyFn(v)
		result[key] = append(result[key], v)
	}
	return result
}

// Find は条件を満たす最初の要素を返す
func Find[T any](slice []T, predicate func(T) bool) (T, bool) {
	for _, v := range slice {
		if predicate(v) {
			return v, true
		}
	}
	var zero T
	return zero, false
}

// SortBy は指定したキーでソートした新しいスライスを返す（元のスライスは変更しない）
func SortBy[T any, K cmp.Ordered](slice []T, keyFn func(T) K) []T {
	copied := make([]T, len(slice))
	copy(copied, slice)

	for i := 1; i < len(copied); i++ {
		for j := i; j > 0 && keyFn(copied[j]) < keyFn(copied[j-1]); j-- {
			copied[j], copied[j-1] = copied[j-1], copied[j]
		}
	}
	return copied
}

// Unique は重複を除いた新しいスライスを返す
func Unique[T comparable](slice []T) []T {
	seen := make(map[T]struct{})
	var result []T
	for _, v := range slice {
		if _, ok := seen[v]; !ok {
			seen[v] = struct{}{}
			result = append(result, v)
		}
	}
	return result
}
CODE,
    ],
    [
        'title' => 'PHPでMiddlewareパイプラインを実装する',
        'language' => 'php',
        'description' => 'Laravelのミドルウェアパイプラインを模した実装。リクエストを複数のミドルウェアに順番に通し、各段階でリクエストの加工やレスポンスの早期リターンを行うパターン',
        'visibility' => 'unlisted',
        'code' => <<<'CODE'
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

/**
 * APIリクエストのロギングミドルウェア
 */
class ApiLogger
{
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        /** @var Response $response */
        $response = $next($request);

        $duration = round((microtime(true) - $startTime) * 1000, 2);

        Log::channel('api')->info('API Request', [
            'method' => $request->method(),
            'path' => $request->path(),
            'status' => $response->getStatusCode(),
            'duration_ms' => $duration,
            'ip' => $request->ip(),
            'user_id' => $request->user()?->id,
        ]);

        $response->headers->set('X-Response-Time', "{$duration}ms");

        return $response;
    }
}

/**
 * APIレートリミットミドルウェア
 */
class ApiRateLimit
{
    public function handle(Request $request, Closure $next): Response
    {
        $key = $this->resolveRateLimitKey($request);
        $maxAttempts = $request->user() ? 120 : 30;

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $retryAfter = RateLimiter::availableIn($key);

            return response()->json([
                'message' => 'リクエスト回数の上限に達しました',
                'retry_after' => $retryAfter,
            ], 429)->withHeaders([
                'Retry-After' => $retryAfter,
                'X-RateLimit-Limit' => $maxAttempts,
                'X-RateLimit-Remaining' => 0,
            ]);
        }

        RateLimiter::hit($key, 60);

        /** @var Response $response */
        $response = $next($request);

        $remaining = RateLimiter::remaining($key, $maxAttempts);
        $response->headers->set('X-RateLimit-Limit', (string) $maxAttempts);
        $response->headers->set('X-RateLimit-Remaining', (string) $remaining);

        return $response;
    }

    private function resolveRateLimitKey(Request $request): string
    {
        return $request->user()
            ? "api:user:{$request->user()->id}"
            : "api:ip:{$request->ip()}";
    }
}
CODE,
    ],
    [
        'title' => 'CSSでFluid Typographyとスペーシング',
        'language' => 'css',
        'description' => 'clamp()関数でビューポート幅に応じてフォントサイズとスペーシングを滑らかに可変させるFluid Typography。メディアクエリなしでレスポンシブなタイポグラフィシステムを構築する',
        'visibility' => 'private',
        'code' => <<<'CODE'
/*
 * Fluid Typography System
 * clamp(min, preferred, max) でビューポートに応じて滑らかにスケール
 * 320px〜1200pxの範囲で補間される
 */

:root {
  /* フォントサイズ（流動的） */
  --text-xs: clamp(0.6875rem, 0.65rem + 0.19vw, 0.75rem);     /* 11px → 12px */
  --text-sm: clamp(0.8125rem, 0.77rem + 0.21vw, 0.875rem);    /* 13px → 14px */
  --text-base: clamp(0.9375rem, 0.88rem + 0.28vw, 1rem);      /* 15px → 16px */
  --text-lg: clamp(1.0625rem, 0.98rem + 0.42vw, 1.1875rem);   /* 17px → 19px */
  --text-xl: clamp(1.25rem, 1.11rem + 0.69vw, 1.5rem);        /* 20px → 24px */
  --text-2xl: clamp(1.5rem, 1.28rem + 1.11vw, 1.875rem);      /* 24px → 30px */
  --text-3xl: clamp(1.875rem, 1.53rem + 1.74vw, 2.5rem);      /* 30px → 40px */
  --text-4xl: clamp(2.25rem, 1.72rem + 2.64vw, 3.25rem);      /* 36px → 52px */

  /* スペーシング（流動的） */
  --space-xs: clamp(0.25rem, 0.2rem + 0.28vw, 0.375rem);      /* 4px → 6px */
  --space-sm: clamp(0.5rem, 0.43rem + 0.35vw, 0.625rem);      /* 8px → 10px */
  --space-md: clamp(0.75rem, 0.63rem + 0.56vw, 1rem);         /* 12px → 16px */
  --space-lg: clamp(1rem, 0.79rem + 1.04vw, 1.5rem);          /* 16px → 24px */
  --space-xl: clamp(1.5rem, 1.15rem + 1.74vw, 2.25rem);       /* 24px → 36px */
  --space-2xl: clamp(2rem, 1.44rem + 2.78vw, 3.25rem);        /* 32px → 52px */

  /* 行の高さ */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}

/* タイポグラフィユーティリティ */
.text-heading-1 {
  font-size: var(--text-4xl);
  line-height: var(--leading-tight);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.text-heading-2 {
  font-size: var(--text-3xl);
  line-height: var(--leading-tight);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.text-heading-3 {
  font-size: var(--text-2xl);
  line-height: var(--leading-tight);
  font-weight: 600;
}

.text-body {
  font-size: var(--text-base);
  line-height: var(--leading-normal);
}

.text-caption {
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--color-ink-secondary);
}

/* スペーシングユーティリティ */
.stack-sm > * + * { margin-top: var(--space-sm); }
.stack-md > * + * { margin-top: var(--space-md); }
.stack-lg > * + * { margin-top: var(--space-lg); }
CODE,
    ],
    [
        'title' => 'JavaScriptでWeb Worker通信の型安全ラッパー',
        'language' => 'javascript',
        'description' => 'Web Workerとのメッセージ通信をPromiseベースでラップし、リクエスト/レスポンスのペアリングとタイムアウト処理を実装する。重い計算をメインスレッドからオフロードするための汎用パターン',
        'expires_at' => '2026-03-01T00:00:00Z',
        'code' => <<<'CODE'
/**
 * Web Workerの通信をPromiseベースでラップするクラス
 * メッセージにIDを付与してリクエスト/レスポンスを対応付ける
 */
class WorkerBridge {
  #worker;
  #pending = new Map();
  #nextId = 0;
  #defaultTimeout;

  constructor(workerUrl, { timeout = 30000 } = {}) {
    this.#worker = new Worker(workerUrl);
    this.#defaultTimeout = timeout;

    this.#worker.addEventListener("message", (event) => {
      const { id, result, error } = event.data;
      const pending = this.#pending.get(id);

      if (!pending) return;

      this.#pending.delete(id);
      clearTimeout(pending.timer);

      if (error) {
        pending.reject(new Error(error));
      } else {
        pending.resolve(result);
      }
    });

    this.#worker.addEventListener("error", (event) => {
      // 全てのpendingリクエストをrejectする
      for (const [id, pending] of this.#pending) {
        clearTimeout(pending.timer);
        pending.reject(new Error(`Worker error: ${event.message}`));
      }
      this.#pending.clear();
    });
  }

  /**
   * Workerにメッセージを送信し、レスポンスをPromiseで返す
   */
  send(type, payload, { timeout } = {}) {
    return new Promise((resolve, reject) => {
      const id = this.#nextId++;
      const timeoutMs = timeout ?? this.#defaultTimeout;

      const timer = setTimeout(() => {
        this.#pending.delete(id);
        reject(new Error(`Worker timeout after ${timeoutMs}ms: ${type}`));
      }, timeoutMs);

      this.#pending.set(id, { resolve, reject, timer });

      this.#worker.postMessage({ id, type, payload });
    });
  }

  /**
   * Workerを終了する
   */
  terminate() {
    for (const [, pending] of this.#pending) {
      clearTimeout(pending.timer);
      pending.reject(new Error("Worker terminated"));
    }
    this.#pending.clear();
    this.#worker.terminate();
  }

  get pendingCount() {
    return this.#pending.size;
  }
}

// --- Worker側 (syntax-worker.js) ---
// self.addEventListener("message", async (event) => {
//   const { id, type, payload } = event.data;
//   try {
//     let result;
//     switch (type) {
//       case "highlight":
//         result = await highlightCode(payload.code, payload.language);
//         break;
//       case "format":
//         result = await formatCode(payload.code, payload.language);
//         break;
//       default:
//         throw new Error(`Unknown message type: ${type}`);
//     }
//     self.postMessage({ id, result });
//   } catch (error) {
//     self.postMessage({ id, error: error.message });
//   }
// });

// --- 使用例 ---
const worker = new WorkerBridge("./syntax-worker.js", { timeout: 10000 });

const highlighted = await worker.send("highlight", {
  code: 'console.log("Hello")',
  language: "javascript",
});

console.log(highlighted);
worker.terminate();
CODE,
    ],
];
