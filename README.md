## 使用技術一覧
### 言語/フレームワーク
[![JavaScript](https://img.shields.io/badge/JavaScript-black?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://developer.mozilla.org/ja/docs/Web/JavaScript) [![NEXT.js](https://img.shields.io/badge/NEXT-black?style=for-the-badge&logo=NEXT.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=REACT)](https://ja.react.dev/)
### バックエンド / データベース
[![SUPABASE](https://img.shields.io/badge/SUPABASE-black?style=for-the-badge&logo=SUPABASE)](https://supabase.com/)
### UI / スタイリング
[![Tailwind](https://img.shields.io/badge/Tailwindcss-black?style=for-the-badge&logo=Tailwindcss)](https://tailwindcss.com/) [![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
## 目次

1. [プロジェクトについて](#プロジェクトについて)
2. [環境](#環境)
3. [開発環境構築](#開発環境構築)
4. [テーマについて](#テーマについて)

# Editor

<!-- プロジェクトについて -->

## プロジェクトについて

自由編集機能を使用した画像作成アプリケーション

## 環境

<!-- 言語、フレームワーク、ミドルウェア、インフラの一覧とバージョンを記載 -->

| 言語・フレームワーク  | バージョン |
| --------------------- | ---------- |
| Next.js                | 14.2.4     |
| React                | 18      |
| SUPABASE | -     |


その他のパッケージのバージョンは package.json を参照してください



## 開発環境構築

<!-- コンテナの作成方法、パッケージのインストール方法など、開発環境構築に必要な情報を記載 -->

### .env.localファイル作成

.env.local ファイルを以下の環境変数例と[環境変数の一覧](#環境変数の一覧)を元に作成

.env.local
NEXT_PUBLIC_SUPABASE_URL=〇〇
NEXT_PUBLIC_SUPABASE_ANON_KEY=〇〇

### 必要なパッケージをインストール
ルートディレクトリで
❯ npm install

### 動作確認
❯ npm run dev

http://localhost:3000 にアクセスできるか確認
アクセスできたら成功


### 環境変数の一覧

| 変数名                 | 役割                                      | デフォルト値|
| ---------------------- | ----------------------------------------- | ----------------------------------|
| NEXT_PUBLIC_SUPABASE_URL    | SUPABASEで発行されるURL | - |
| NEXT_PUBLIC_SUPABASE_ANON_KEY         | SUPABASEで発行される秘密鍵   | - |


## テーマについて
テーマは
./src/lib/theme/mainTheme.ts
で設定
```javascript
const colors = {
  primary: '#5eae53',
  secondary: '#8dc686',
  primaryDark:'#5eae53',
  secondaryDark:'#8dc686',
  accent: '#8dc686'
};
```
この変数のカラーコードを変えることで全体のテーマを変更