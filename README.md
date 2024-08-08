## 使用技術一覧

### 言語/フレームワーク

[![JavaScript](https://img.shields.io/badge/JavaScript-black?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://developer.mozilla.org/ja/docs/Web/JavaScript) [![NEXT.js](https://img.shields.io/badge/NEXT-black?style=for-the-badge&logo=NEXT.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=REACT)](https://ja.react.dev/) [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)](https://nodejs.org/)

### バックエンド / データベース

[![SUPABASE](https://img.shields.io/badge/SUPABASE-black?style=for-the-badge&logo=SUPABASE)](https://supabase.com/)

### UI / スタイリング

[![Tailwind](https://img.shields.io/badge/Tailwindcss-black?style=for-the-badge&logo=Tailwindcss)](https://tailwindcss.com/) [![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)

## 目次

1. [プロジェクトについて](#プロジェクトについて)

2. [ディレクトリ構成](#ディレクトリ構成)

3. [環境](#環境)

4. [開発環境構築](#開発環境構築)

5. [自由編集機能について](#自由編集機能について)

6. [テーマについて](#テーマについて)

7. [バックエンド/認証について](#バックエンド/認証について)


# Editor
<!-- プロジェクトについて -->

## プロジェクトについて

:memo: 自由編集機能を使用した画像作成アプリケーション

## ディレクトリ構成
<details>

<summary>開く</summary>

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
│   │   │   │   └── [page_index] .............. ページネーションのインデックス番号
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
│   │   ├── auth ............................. 認証関係
│   │   │   ├── Login.tsx
│   │   │   ├── Logout.tsx
│   │   │   └── Singup.tsx
│   │   ├── PageTitle.tsx
│   │   ├── TopMenuBtn.tsx
│   │   ├── fabric ........................... 自由編集画面関係
│   │   │   ├── bubbleMenu ................... バブルメニュー
│   │   │   │   ├── BubbleMenu.tsx
│   │   │   │   ├── DeleteBtn.tsx
│   │   │   │   └── GroupBtn.tsx
│   │   │   ├── Editor.tsx
│   │   │   ├── expansionBtns ................ ズームイン/アウト
│   │   │   │   ├── ExpansionBtns.tsx
│   │   │   │   ├── PanningBtn.tsx
│   │   │   │   └── ZoomBtns.tsx
│   │   │   ├── PageBack.tsx
│   │   │   └── fixedMenu .................... 下部固定メニュー
│   │   │       ├── FontSizeMenu ............. フォントサイズ変更関連
│   │   │       │   ├── BackBtn.tsx
│   │   │       │   ├── ChangeFontSizeSlider.tsx
│   │   │       │   ├── FontSizeMenu.tsx
│   │   │       │   └── FontSizeSliderMb.tsx
│   │   │       ├── Menu.tsx
│   │   │       ├── defaultMenu .............  初期表示メニュー関連
│   │   │       │   ├── AddFileBtn.tsx
│   │   │       │   ├── AddTextBtn.tsx
│   │   │       │   ├── DefaultMenu.tsx
│   │   │       │   ├── DeleteBts.tsx
│   │   │       │   ├── ExportImageBtn.tsx
│   │   │       │   ├── ExportPdfBtn.tsx
│   │   │       │   ├── RedoBtn.tsx
│   │   │       │   ├── SaveBtn.tsx
│   │   │       │   └── UndoBtn.tsx
│   │   │       └── textMenu ................. テキスト選択時メニュー関連
│   │   │           ├── ChangeColorBtn.tsx
│   │   │           ├── ChangeColorBtnMb.tsx
│   │   │           ├── ChangeFontBtn.tsx
│   │   │           ├── ChangeFontBtnMb.tsx
│   │   │           ├── ChangeFontSizeBtn.tsx
│   │   │           └── TextMenu.tsx
│   │   └── dashboard ........................ ダッシュボード
│   │       ├── Dashboard.tsx
│   │       ├── Pagination.tsx
│   │       ├── RegisterButton.tsx
│   │       ├── RegisterButtonMb.tsx
│   │       ├── RegisterModal.tsx
│   │       └── Preview.tsx
│   ├── hooks
│   │   ├── auth ............................. 認証関連のカスタムフック
│   │   │   └── useAuth.ts
│   │   └── fabric ........................... 自由編集のカスタムフック
│   │       ├── useEditor.ts .................  Editorのメインとなるフック
│   │       ├── useEvent.ts ..................  イベントハンドラ関連
│   │       ├── useInitCanvas.ts .............  Canvas初期化関連
│   │       └── useSave.ts ................... Canvas保存関連
│   ├── lib
│   │   └── theme ............................ tailwindとmuiのテーマ設定ファイル
│   │       └── mainTheme.ts
│   ├── middleware.ts
│   └── type ................................. 型定義ファイル
│       └── fabricType.ts
├── tailwind.config.ts
└── tsconfig.json
```

</details>

## 環境

<!-- 言語、フレームワーク、ミドルウェア、インフラの一覧とバージョンを記載 -->

| 言語・フレームワーク | バージョン |
| -----------------| --------- |
| Node.js          | 20.10.0   |
| npm              | 10.2.3   |
| Next.js          | 14.2.4    |
| React            | 18        |
| SUPABASE         | -         |


:bulb: その他のパッケージのバージョンは package.json を参照してください




## 開発環境構築


<!-- コンテナの作成方法、パッケージのインストール方法など、開発環境構築に必要な情報を記載 -->

###  .env.localファイル作成

.env.local ファイルを以下の環境変数例と[環境変数の一覧](#環境変数の一覧)を元に作成

:open_file_folder:  .env.local

```
NEXT_PUBLIC_SUPABASE_URL=〇〇
NEXT_PUBLIC_SUPABASE_ANON_KEY=〇〇
```

###  必要なパッケージをインストール

ルートディレクトリで

```
❯ npm install
```

###  動作確認

```
❯ npm run dev
```

http://localhost:3000 にアクセスできるか確認

アクセスできたら成功:bulb:

### 環境変数の一覧

| 変数名                        | 役割                    | デフォルト値|
| -----------------------------| -----------------------| ----------|
| NEXT_PUBLIC_SUPABASE_URL     | SUPABASEで発行されるURL  | -         |
| NEXT_PUBLIC_SUPABASE_ANON_KEY| SUPABASEで発行される秘密鍵| -         |


## 自由編集機能について
Canvas操作に[fabric.js](http://fabricjs.com/)ライブラリを使用 :memo:

### 機能
| 機能                  | 備考                               |
| -------------------- | --------------------------------- |
| オブジェクト追加        | テキスト・画像を挿入可能              |
| オブジェクト削除        | オブジェクトの削除                   |
| オブジェクト移動        | Canvas内のオブジェクトの移動         |
| オブジェクトスケーリング | オブジェクトの拡大・縮小              |
| 前に戻る・次へ進む      | Canvasの変更履歴を50個まで戻る・進む   |
| 画像出力              | Canvasをpngファイルとしてローカルに保存 |
| PDF出力              | CanvasをPDFファイルとしてローカルに保存 |
| 一時保存              | Canvasの内容をデータベースに格納       |
| 削除                 | データベースに格納していたデータを削除   |
| テキスト色変更         | テキストの色を変更                   |
| テキストサイズ変更      | テキストのサイズ変更                 |
| テキストフォント変更    | テキストのフォント変更                |
| 表示領域拡大・縮小      | Cnvasの表示領域の拡大・縮小           |


### データ保存
- CanvasをJSONオブジェクトに変換し、[データベース(keepsテーブル)](#keepsテーブル)に格納
- データ保存の際は任意のタイトルを付ける
- 更新の際は、ファブリックオブジェクト・タイトル・SVGのみを更新


### 画像データの扱い
- 保存前の画像はbase64データ(fabricのデフォルトの仕様)
- [データ保存](#データ保存)するタイミングで、base64をBlobに変換、その後[SUPABASEのストレージ](#ストレージ)に画像を格納
- 保存された画像には一意なuuidをつけているので、削除の際は対象の画像のみを削除
- 更新の際も変更された分のみを追加・削除




## テーマについて

テーマは
```
./src/lib/theme/mainTheme.ts
```
で設定 :gear:

```javascript
const colors = {
  primary: '#5eae53',
  secondary: '#8dc686',
  primaryDark:'#5eae53',
  secondaryDark:'#8dc686',
  accent: '#8dc686'
};
```

この変数のカラーコードを変えることで全体のテーマを変更 :art:

## バックエンド/認証について

バックエンド/認証にはSUPABASEを使用

### データベース

基本的にはCRUD処理のみなので[SUPABASE Database](https://supabase.com/docs/guides/database/overview)(PostgressSQL)を使用

#### テーブル一覧

##### keepsテーブル

| カラム         | 型           | 備考                           |
| ------------- | ----------- | ------------------------------ |
| uuid          | uuid        | 一意なid                        |
| user_id       | uuid        | ユーザー識別用uuid               |
| title         | text        | タイトル                        |
| fabric_object | jsonb       | CanvasをJsonオブジェクトにしたもの |
| width         | int2        | Canvasの幅                     |
| height        | int2        | Canvasの高さ                    |
| svg           | text        | CanvasをSVGにしたもののパス       |
| created_at    | timestamptz | 作成日                          |

---

### ストレージ

[SUPABASE Storage](https://supabase.com/docs/guides/storage)を使用

自由編集で使用する画像やCanvasをSVGにエクスポートした物をストレージに格納
ストレージ内ディレクトリ構成

```
.
├── fabric
│   └── [keep_uuid]
│     　└── [image_uuid].png
└── svg
    └── [keep_uuid]
  　　 　└── [image_uuid].svg
```



>[!IMPORTANT]
>[keep_uuid]には格納されている[テーブル](#keepsテーブル)のuuidが入る</br>
>[image_uuid]には画像を識別する一意なuuidが入る


---

### 認証

[SUPABASE Auth](https://supabase.com/docs/guides/auth)を使用

現段階ではEmail認証のみ
