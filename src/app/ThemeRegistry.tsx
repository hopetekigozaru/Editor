// app/ThemeRegistry.tsx
'use client';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import { useState } from 'react';
import { muiTheme } from '@/lib/theme/mainTheme';

// ThemeRegistryコンポーネントは、EmotionのキャッシュとMaterial-UIのテーマを設定します。
// 特に、サーバーサイドレンダリング(SSR)の際にEmotionで生成されたスタイルを適切に処理します。
export default function ThemeRegistry(props: any) {
  const { options, children } = props;

  // Emotionのキャッシュとフラッシュ関数を設定
  const [{ cache, flush }] = useState(() => {
    const cache = createCache(options);
    cache.compat = true; // Emotionの互換性モードを有効にします

    // キャッシュのカスタムinsert関数を作成
    const prevInsert = cache.insert;
    let inserted: string[] = []; // 挿入されたスタイルの名前を追跡する配列
    cache.insert = (...args) => {
      const serialized = args[1];
      // スタイルがまだ挿入されていない場合に追加
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    // フラッシュ関数を作成
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache, flush };
  });

  // サーバーサイドで挿入されたスタイルを処理します
  useServerInsertedHTML(() => {
    const names = flush(); // 挿入されたスタイルの名前を取得
    if (names.length === 0) {
      return null; // 挿入されたスタイルがない場合は何も返さない
    }
    let styles = '';
    // 挿入されたスタイルの名前に基づいてスタイルを組み立てます
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`} // Emotionのキーと挿入されたスタイルの名前を設定
        dangerouslySetInnerHTML={{
          __html: styles, // スタイルをHTMLとして挿入
        }}
      />
    );
  });

  // CacheProviderとThemeProviderでEmotionとMaterial-UIのテーマを設定
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </CacheProvider>
  );
}
