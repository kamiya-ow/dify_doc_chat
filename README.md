# Dify チャットフローアプリ

DifyのAPIを使ってチャットフローを呼び出すNode.jsアプリケーションです。

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. 環境変数を設定:
```bash
cp .env.example .env
```

`.env`ファイルを編集して、以下の値を設定してください：
- `DIFY_API_URL`: DifyのAPIのURL（デフォルト: `https://api.dify.ai/v1`）
- `DIFY_API_KEY`: DifyのAPIキー
- `DIFY_APP_TOKEN`: DifyアプリのAPIトークン
- `DIFY_APP_PASS`: Difyアプリのパスワード（チャットフロー内のinputsで使用）

## 使い方

アプリを起動:
```bash
npm start
```

開発モード（ファイル変更時に自動再起動）:
```bash
npm run dev
```

## 機能

- インタラクティブなチャットインターface
- 会話履歴の管理
- 環境変数による設定管理
- エラーハンドリング

## プロジェクト構造

```
dify_doc_chat/
├── src/
│   ├── app.js           # メインアプリケーション
│   └── dify-client.js   # Dify APIクライアント
├── .env.example         # 環境変数のテンプレート
├── .gitignore          # Git除外ファイル
├── package.json        # プロジェクト設定
└── README.md          # このファイル
```