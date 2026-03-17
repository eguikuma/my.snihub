FROM node:22-slim

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 依存パッケージのインストール
COPY package.json pnpm-lock.yaml* ./
RUN if [ -f package.json ]; then pnpm install --frozen-lockfile; fi

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
