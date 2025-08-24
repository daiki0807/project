# Node.js 20のAlpine Linuxベースイメージを使用
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# package-lock.jsonを削除して依存関係を再インストール（Rollup問題対策）
RUN rm -f package-lock.json && npm install

# アプリケーションのソースコードをコピー
COPY . .

# TypeScriptをビルドしてUIとサーバーをコンパイル
RUN npm run build

# distディレクトリの権限を確認・修正
RUN ls -la && ls -la dist/

# ポート8080を公開（Cloud Runのデフォルト）
EXPOSE 8080

# アプリケーションを起動（dist/server.jsを実行）
CMD ["node", "dist/server.js"]