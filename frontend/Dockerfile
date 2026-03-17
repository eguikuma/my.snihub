FROM node:22-slim

# ホストの UID/GID と一致させる
ARG UID=1000
ARG GID=1000

# ホスト用のユーザーを作成し、非 root ユーザーで実行する
RUN groupmod -g ${GID} node \
    && usermod -u ${UID} -g ${GID} node

WORKDIR /app
RUN chown node:node /app

# 依存パッケージのインストール
COPY --chown=node:node package.json pnpm-lock.yaml* ./
RUN if [ -f package.json ]; then \
    corepack enable; \
    corepack install; \
    pnpm install --frozen-lockfile; fi

COPY --chown=node:node . .

USER node

COPY --chown=node:node entrypoint.sh /usr/local/bin/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["entrypoint.sh"]
CMD ["pnpm", "dev"]
