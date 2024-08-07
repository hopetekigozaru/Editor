## 使用技術一覧

[![NEXT.js](https://img.shields.io/badge/NEXT-black?style=for-the-badge&logo=NEXT.js)](https://nextjs.org/) [![SUPABASE](https://img.shields.io/badge/SUPABASE-black?style=for-the-badge&logo=SUPABASE)](https://supabase.com/) [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=REACT)](https://ja.react.dev/) [![Tailwind](https://img.shields.io/badge/Tailwindcss-black?style=for-the-badge&logo=Tailwindcss)](https://tailwindcss.com/)
## 目次

1. [プロジェクトについて](#プロジェクトについて)
2. [環境](#環境)
3. [ディレクトリ構成](#ディレクトリ構成)
4. [開発環境構築](#開発環境構築)

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


## ディレクトリ構成

<!-- Treeコマンドを使ってディレクトリ構成を記載 -->

❯ tree -a -I "node_modules|.next|.git" -d
.
├── .env.example
├── .env.local
├── .eslintrc.json
├── .gitignore
├── README.md
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── public
│   └── images
└── src
    ├── app
    │   ├── (auth)
    │   │   ├── dashboard
    │   │   │   └── [page_index]
    │   │   ├── edit
    │   │   └── register
    │   ├── (login)
    │   │   └── signup
    │   │       └── pre_register
    │   └── api
    │       ├── delete
    │       ├── deleteImage
    │       ├── getKeeps
    │       ├── imageUpload
    │       ├── register
    │       ├── svg
    │       │   └── register
    │       └── update
    ├── components
    │   ├── Auth
    │   ├── fablic
    │   │   ├── BubbleMenu
    │   │   ├── ExpansionBtns
    │   │   └── fixedMenu
    │   │       ├── FontSizeMenu
    │   │       ├── defaultMenu
    │   │       └── textMenu
    │   └── list
    ├── hooks
    │   ├── Auth
    │   └── fabric
    ├── lib
    │   └── theme
    └── type


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
