import { CustomLineOptions } from "@/type/fabricType";
import { useEffect, useRef, useState } from "react";

export const useInitCanvas = (aspectRatio: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const [gridLines, setGridLines] = useState<fabric.Line[]>([]);
  const [windowSize, setWindowSize] = useState<{ windowWidth: number | undefined, windowHeight: number | undefined }>({
    windowWidth: undefined,
    windowHeight: undefined,
  });
  const [isMobile, setisMobile] = useState(true);


  /**
   * リサイズイベント
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
    // クライアントサイドでのみ実行
    if (typeof window !== 'undefined') {
      setisMobile(window.innerWidth < window.innerHeight);

      // 初期サイズを設定
      handleResize();

      // リサイズイベントを設定
      window.addEventListener('resize', handleResize);

      // クリーンアップ関数
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // キャンバスの高さと幅を設定
  useEffect(() => {
    if (containerRef.current && windowSize.windowWidth && windowSize.windowHeight) {
      if (isMobile) {
        if (aspectRatio > 1) {

          const offsetWidth = containerRef.current.clientWidth;
          const offsetHeight = offsetWidth / aspectRatio;

          setCanvasHeight(offsetHeight);
          setCanvasWidth(offsetWidth);
        }  else {
          const offsetHeight = containerRef.current.offsetHeight;
          const offsetWidth = offsetHeight * aspectRatio;

          setCanvasHeight(offsetHeight);
          setCanvasWidth(offsetWidth);
        }
      } else {
        const offsetHeight = containerRef.current.offsetHeight;
        const offsetWidth = offsetHeight * aspectRatio;

        setCanvasHeight(offsetHeight);
        setCanvasWidth(offsetWidth);
      }
    }
  }, [containerRef, windowSize,aspectRatio,isMobile]);

  // fabricキャンバス初期化
  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('fabric-with-gestures').then(({ fabric }) => {
      const canvasElm = canvasRef.current;
      if (!canvasElm || canvasWidth === 0 || canvasHeight === 0) return;

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
   * Canvasにグリットラインを引く関数
   * @param canvas
   */
  const drawGrid = async (canvas: fabric.Canvas) => {
    const { fabric } = await import('fabric');
    const canvasHeight = canvas.getHeight();
    const canvasWidth = canvas.getWidth();
    const gridSize = canvasHeight / 4;
    const lines: fabric.Line[] = [];

    // 垂直線を描画
    for (let i = 1; i < canvasWidth / gridSize; i++) {
      const x = i * gridSize;
      if (x < canvasWidth) {
        const vertical = new fabric.Line(
          [x, 0, x, canvasHeight],
          { stroke: '#ccc', selectable: false, evented: false, isGrid: true } as CustomLineOptions
        );
        lines.push(vertical);
        canvas.add(vertical);
        vertical.moveTo(0); // オブジェクトを一番背面に移動
      }
    }

    // 水平線を描画
    for (let i = 1; i < canvasHeight / gridSize; i++) {
      const y = i * gridSize;
      if (y < canvasHeight) {
        const horizontal = new fabric.Line(
          [0, y, canvasWidth, y],
          { stroke: '#ccc', selectable: false, evented: false, isGrid: true } as CustomLineOptions
        );
        lines.push(horizontal);
        canvas.add(horizontal);
        horizontal.moveTo(0); // オブジェクトを一番背面に移動
      }
    }

    // レンダリングして表示
    canvas.renderAll();

    // グリッドラインを保存する
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
