.PHONY: setup up down restart logs

# 初回セットアップ
setup:
	@test -f backend/.env || cp backend/.env.example backend/.env
	@test -f frontend/.env.local || cp frontend/.env.example frontend/.env.local
	docker compose up --build -d

# コンテナ起動
up:
	docker compose up -d

# コンテナ停止
down:
	docker compose down

# コンテナ再起動
restart:
	docker compose restart

# ログ表示
logs:
	docker compose logs -f
