import { CustomLineOptions } from "@/type/fabricType";
import { useEffect, useRef, useState } from "react";

export const useInitCanvas = (aspectRatio: number) => {
  const containerRef = useRef<HTMLDivElement>(null); // キャンバスを含むコンテナの参照
  const canvasRef = useRef<HTMLCanvasElement>(null); // HTMLCanvasElementの参照
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null); // fabric.Canvas インスタンス
  const [canvasWidth, setCanvasWidth] = useState<number>(0); // キャンバスの幅
  const [canvasHeight, setCanvasHeight] = useState<number>(0); // キャンバスの高さ
  const [gridLines, setGridLines] = useState<fabric.Line[]>([]); // 描画されたグリッドライン
  const [windowSize, setWindowSize] = useState<{ windowWidth: number | undefined, windowHeight: number | undefined }>({
    windowWidth: undefined,
    windowHeight: undefined,
  });
  const [isMobile, setIsMobile] = useState(true); // モバイルデバイスかどうかの判定

  /**
   * ウィンドウのリサイズイベントに対応する関数です。
   * ウィンドウの幅と高さを state に設定します。
   */
  const handleResize = () => {
    if (typeof window !== 'undefined') {
      setWindowSize({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });
    }
  };

  useEffect(() => {
    // クライアントサイドでのみ実行する処理
    if (typeof window !== 'undefined') {
      // モバイルデバイスの判定
      setIsMobile(window.innerWidth < window.innerHeight);

      // 初期サイズを設定
      handleResize();

      // リサイズイベントリスナーを設定
      window.addEventListener('resize', handleResize);

      // クリーンアップ関数: リサイズイベントリスナーを解除
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // キャンバスのサイズを設定する useEffect
  useEffect(() => {
    if (containerRef.current && windowSize.windowWidth && windowSize.windowHeight) {
      if (isMobile) {
        if (aspectRatio > 1) {
          // モバイルデバイスでアスペクト比が1より大きい場合
          const offsetWidth = containerRef.current.clientWidth;
          const offsetHeight = offsetWidth / aspectRatio;

          setCanvasHeight(offsetHeight);
          setCanvasWidth(offsetWidth);
        } else {
          // モバイルデバイスでアスペクト比が1以下の場合
          const offsetHeight = containerRef.current.offsetHeight;
          const offsetWidth = offsetHeight * aspectRatio;

          setCanvasHeight(offsetHeight);
          setCanvasWidth(offsetWidth);
        }
      } else {
        // デスクトップデバイス
        const offsetHeight = containerRef.current.offsetHeight;
        const offsetWidth = offsetHeight * aspectRatio;

        setCanvasHeight(offsetHeight);
        setCanvasWidth(offsetWidth);
      }
    }
  }, [containerRef, windowSize, aspectRatio, isMobile]);

  // fabricキャンバスを初期化する useEffect
  useEffect(() => {
    if (typeof window === 'undefined') return; // サーバーサイドレンダリングでは実行しない

    import('fabric-with-gestures').then(({ fabric }) => {
      const canvasElm = canvasRef.current;
      if (!canvasElm || canvasWidth === 0 || canvasHeight === 0) return;

      // fabric.Canvas インスタンスを作成
      const canvasInstance = new fabric.Canvas(canvasElm, {
        selection: false,
      });

      setCanvas(canvasInstance);
      // Cleanup on unmount
      return () => {
        if (canvasInstance) {
          canvasInstance.dispose();
        }
      };
    });
  }, [canvasWidth, canvasHeight]);

  /**
   * キャンバスにグリッドラインを描画する関数です。
   * @param canvas - fabric.Canvas インスタンス
   */
  const drawGrid = async (canvas: fabric.Canvas) => {
    const { fabric } = await import('fabric');
    const canvasHeight = canvas.getHeight();
    const canvasWidth = canvas.getWidth();
    const gridSize = canvasHeight / 4; // グリッドのサイズ
    const lines: fabric.Line[] = []; // グリッドラインを格納する配列

    // 垂直グリッドラインを描画
    for (let i = 1; i < canvasWidth / gridSize; i++) {
      const x = i * gridSize;
      if (x < canvasWidth) {
        const vertical = new fabric.Line(
          [x, 0, x, canvasHeight],
          { stroke: '#ccc', selectable: false, evented: false, isGrid: true } as CustomLineOptions
        );
        lines.push(vertical);
        canvas.add(vertical);
        vertical.moveTo(0); // グリッドラインを一番背面に移動
      }
    }

    // 水平グリッドラインを描画
    for (let i = 1; i < canvasHeight / gridSize; i++) {
      const y = i * gridSize;
      if (y < canvasHeight) {
        const horizontal = new fabric.Line(
          [0, y, canvasWidth, y],
          { stroke: '#ccc', selectable: false, evented: false, isGrid: true } as CustomLineOptions
        );
        lines.push(horizontal);
        canvas.add(horizontal);
        horizontal.moveTo(0); // グリッドラインを一番背面に移動
      }
    }

    // キャンバスを再描画
    canvas.renderAll();

    // グリッドラインを state に保存
    setGridLines(lines);
  };

  return {
    canvas,
    isMobile,
    canvasRef,
    containerRef,
    canvasWidth,
    canvasHeight,
    drawGrid,
    setGridLines,
    gridLines
  };
};
