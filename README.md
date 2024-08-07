## 使用技術一覧
### 言語/フレームワーク
[![JavaScript](https://img.shields.io/badge/JavaScript-black?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://developer.mozilla.org/ja/docs/Web/JavaScript) [![NEXT.js](https://img.shields.io/badge/NEXT-black?style=for-the-badge&logo=NEXT.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=REACT)](https://ja.react.dev/)
### バックエンド / データベース
[![SUPABASE](https://img.shields.io/badge/SUPABASE-black?style=for-the-badge&logo=SUPABASE)](https://supabase.com/)
### UI / スタイリング
[![Tailwind](https://img.shields.io/badge/Tailwindcss-black?style=for-the-badge&logo=Tailwindcss)](https://tailwindcss.com/) [![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
</br>

## 目次

1. [プロジェクトについて](#プロジェクトについて)
2. [ディレクトリ構成](#ディレクトリ構成)
3. [環境](#環境)
4. [開発環境構築](#開発環境構築)
5. [テーマについて](#テーマについて)

</br>

# Editor
</br>
<!-- プロジェクトについて -->

## プロジェクトについて
自由編集機能を使用した画像作成アプリケーション

</br>

## ディレクトリ構成
```
.
├── .env.example
├── .env.local
├── .eslintrc.json
├── README.md
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── next.svg
│   └── vercel.svg
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── dashboard
│   │   │   │   └── [page_index]
│   │   │   │       └── page.tsx
│   │   │   ├── edit
│   │   │   │   └── page.tsx
│   │   │   └── register
│   │   │       └── page.tsx
│   │   ├── (login)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── signup
│   │   │       ├── page.tsx
│   │   │       └── pre_register
│   │   │           └── page.tsx
│   │   ├── ThemeRegistry.tsx
│   │   ├── api
│   │   │   ├── delete
│   │   │   │   └── route.ts
│   │   │   ├── deleteImage
│   │   │   │   └── route.ts
│   │   │   ├── getKeeps
│   │   │   │   └── route.ts
│   │   │   ├── imageUpload
│   │   │   │   └── route.ts
│   │   │   ├── register
│   │   │   │   └── route.ts
│   │   │   ├── svg
│   │   │   │   └── register
│   │   │   │       └── route.ts
│   │   │   └── update
│   │   │       └── route.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components
│   │   ├── auth
│   │   │   ├── Login.tsx
│   │   │   ├── Logout.tsx
│   │   │   └── Singup.tsx
│   │   ├── PageTitle.tsx
│   │   ├── TopMenuBtn.tsx
│   │   ├── fablic
│   │   │   ├── bubbleMenu
│   │   │   │   ├── BubbleMenu.tsx
│   │   │   │   ├── DeleteBtn.tsx
│   │   │   │   └── GroupBtn.tsx
│   │   │   ├── Editor.tsx
│   │   │   ├── expansionBtns
│   │   │   │   ├── ExpansionBtns.tsx
│   │   │   │   ├── PanningBtn.tsx
│   │   │   │   └── ZoomBtns.tsx
│   │   │   ├── PageBack.tsx
│   │   │   └── fixedMenu
│   │   │       ├── FontSizeMenu
│   │   │       │   ├── BackBtn.tsx
│   │   │       │   ├── ChangeFontSizeSlider.tsx
│   │   │       │   ├── FontSizeMenu.tsx
│   │   │       │   └── FontSizeSliderMb.tsx
│   │   │       ├── Menu.tsx
│   │   │       ├── defaultMenu
│   │   │       │   ├── AddFileBtn.tsx
│   │   │       │   ├── AddTextBtn.tsx
│   │   │       │   ├── DefaultMenu.tsx
│   │   │       │   ├── DeleteBts.tsx
│   │   │       │   ├── ExportImageBtn.tsx
│   │   │       │   ├── ExportPdfBtn.tsx
│   │   │       │   ├── RedoBtn.tsx
│   │   │       │   ├── SaveBtn.tsx
│   │   │       │   └── UndoBtn.tsx
│   │   │       └── textMenu
│   │   │           ├── ChangeColorBtn.tsx
│   │   │           ├── ChangeColorBtnMb.tsx
│   │   │           ├── ChangeFontBtn.tsx
│   │   │           ├── ChangeFontBtnMb.tsx
│   │   │           ├── ChangeFontSizeBtn.tsx
│   │   │           └── TextMenu.tsx
│   │   └── dashboard
│   │       ├── Dashboard.tsx
│   │       ├── Pagination.tsx
│   │       ├── RegisterButton.tsx
│   │       ├── RegisterButtonMb.tsx
│   │       ├── RegisterModal.tsx
│   │       └── Preview.tsx
│   ├── hooks
│   │   ├── auth
│   │   │   └── useAuth.ts
│   │   └── fabric
│   │       ├── useEditor.ts
│   │       ├── useEvent.ts
│   │       ├── useInitCanvas.ts
│   │       └── useSave.ts
│   ├── lib
│   │   └── theme
│   │       └── mainTheme.ts
│   ├── middleware.ts
│   └── type
│       └── fabricType.ts
├── tailwind.config.ts
└── tsconfig.json
```
### 1. components/Authディレクトリ
&emsp; 認証関係のコンポーネントファイル
### 2. components/fabricディレクトリ
&emsp; 自由編集画面関係コンポーネント
#### &emsp; ① /bubbleMenu
&emsp;&emsp; バブルメニューコンポーネント
#### &emsp; ② /expansionBtns
&emsp;&emsp; ズームイン/アウトコンポーネント
#### &emsp; ③ /fixedMenu
&emsp;&emsp; 下部固定メニューコンポーネント
##### &emsp;&emsp;&emsp;/FontSizeMenu
&emsp;&emsp;&emsp;フォントサイズ変更関連コンポーネント
##### &emsp;&emsp;&emsp;/defaultMenu
&emsp;&emsp;&emsp;初期表示メニュー関連コンポーネント
##### &emsp;&emsp;&emsp;/textMenu　
&emsp;&emsp;&emsp;テキスト選択時メニュー関連コンポーネント
### 3. components/dashboardディレクトリ
&emsp; ダッシュボードコンポーネント
### 4. hooks/authディレクトリ
&emsp; 認証関連のカスタムフック
### 5. hooks/fabricディレクトリ
&emsp; 自由編集のカスタムフック
### 6. lib/themeディレクトリ
&emsp; tailwindとmuiのテーマ設定ファイル
### 7. typeディレクトリ
&emsp; 型定義ファイル

</br>

## 環境

<!-- 言語、フレームワーク、ミドルウェア、インフラの一覧とバージョンを記載 -->

| 言語・フレームワーク  | バージョン |
| --------------------- | ---------- |
| Next.js                | 14.2.4     |
| React                | 18      |
| SUPABASE | -     |


その他のパッケージのバージョンは package.json を参照してください

</br>

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

</br>

### 環境変数の一覧

| 変数名                 | 役割                                      | デフォルト値|
| ---------------------- | ----------------------------------------- | ----------------------------------|
| NEXT_PUBLIC_SUPABASE_URL    | SUPABASEで発行されるURL | - |
| NEXT_PUBLIC_SUPABASE_ANON_KEY         | SUPABASEで発行される秘密鍵   | - |

</br>

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