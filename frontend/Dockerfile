FROM node:22-slim

# ホストの UID/GID と一致させる
ARG UID=1000
ARG GID=1000

RUN corepack enable && corepack prepare pnpm@latest --activate

# ホスト用のユーザーを作成し、非 root ユーザーで実行する
RUN groupmod -g ${GID} node \
    && usermod -u ${UID} -g ${GID} node

WORKDIR /app
RUN chown node:node /app

# 依存パッケージのインストール
COPY --chown=node:node package.json pnpm-lock.yaml* ./
RUN if [ -f package.json ]; then pnpm install --frozen-lockfile; fi

COPY --chown=node:node . .

USER node

EXPOSE 3000

CMD ["pnpm", "dev"]
