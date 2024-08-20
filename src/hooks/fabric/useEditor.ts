'use client'
import { useTheme } from '@mui/material';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric-with-gestures';
import { useEvent } from './useEvent';
import { useInitCanvas } from './useInitCanvas';
import { keep } from '@/type/fabricType';

export const useEditor = (keep: keep | null, aspectRatio: number) => {
  const bubbleRef = useRef<HTMLDivElement>(null); // バブルメニューの参照
  const [bubbleMenuPosition, setBubbleMenuPosition] = useState<{ left: number | undefined; top: number | undefined }>({ left: 0, top: 0 });
  const [selectObject, setSelectObject] = useState<boolean>(false); // オブジェクト選択状態
  const [undoStack, setUndoStack] = useState<string[]>([]); // Undo スタック
  const [redoStack, setRedoStack] = useState<string[]>([]); // Redo スタック
  const [continuous, setContinuous] = useState<boolean>(false); // 継続的な操作状態
  const [loading, setLoading] = useState<string | null>(null); // ローディング状態
  const [size, setSize] = useState<CSSProperties | null>(); // キャンバスのサイズ
  const theme = useTheme(); // テーマ設定
  const MAX_HISTORY = 50; // 履歴の最大数

  // キャンバスの初期化と関連情報の取得
  const {
    canvas,
    isMobile,
    canvasRef,
    containerRef,
    canvasWidth,
    canvasHeight,
    drawGrid,
    setGridLines,
    gridLines
  } = useInitCanvas(aspectRatio);

  // イベントハンドラを取得
  const {
    handleObjectMoving,
    handleObjectScaling,
    handleObjectAdded,
    handleMouseMove,
    handleMouseUp,
    handleSelectionClear,
    handleMouseDown,
    constrainViewport,
  } = useEvent(canvas, isMobile);

  // アスペクト比に応じたキャンバスサイズの設定
  useEffect(() => {
    if (aspectRatio > 1) {
      setSize({ width: '100%' });
    } else {
      setSize({ height: '40vh' });
    }
  }, [aspectRatio]);

  /**
   * グリッドのプロパティを復元する関数です。
   * @param canvas - fabric.Canvas オブジェクト
   */
  const restoreGridProperties = (canvas: fabric.Canvas) => {
    // キャンバス内の全オブジェクトに対して処理を行う
    canvas.getObjects().forEach((obj) => {
      // グリッドオブジェクトの場合、選択不可およびイベント無効に設定
      if ((obj as any).isGrid) {
        obj.set({ selectable: false, evented: false });
      }
    });
  };

  /**
   * スタックに履歴を追加する関数です。
   * 最大履歴数を超えた場合、古い履歴を削除します。
   * @param stack - 現在の履歴
   * @param item - 追加する履歴
   * @returns 新しい履歴
   */
  const addToStack = (stack: string[], item: string) => {
    // 新しい履歴を追加し、最大履歴数に制限
    const newStack = [...stack, item];
    return newStack.slice(-MAX_HISTORY);
  };

  /**
   * 現在のキャンバスの状態を保存する関数です。
   * 直前の状態と比較して変更があった場合のみ保存します。
   */
  const saveState = useCallback(() => {
    if (canvas) {
      const currentState = JSON.stringify(canvas.toJSON(['isGrid']));
      // 直前の状態と異なる場合のみ保存
      if (undoStack.length === 0 || currentState !== undoStack[undoStack.length - 1]) {
        setUndoStack(prevStack => addToStack(prevStack, currentState));
        setRedoStack([]); // Redo スタックをクリア
      }
    }
  }, [canvas, undoStack]);

  /**
   * JSONデータを用いてキャンバスの状態を復元する関数です。
   * @param canvas - fabric.Canvas オブジェクト
   */
  const loadJson = async (canvas: fabric.Canvas) => {
    if (keep) {
      // JSONデータを使用してキャンバスを復元
      canvas.loadFromJSON(keep!.fabric_object, async () => {
        canvas.forEachObject(obj => {
          obj as fabric.Object;
          const scaleX = canvas.getWidth() / keep.width;
          const scaleY = canvas.getHeight() / keep.height;

          // オブジェクトのプロパティを設定
          obj.set({
            borderColor: theme.palette.secondary.main,  // 枠線の色
            cornerColor: theme.palette.secondary.main,  // コーナーの色
            cornerStyle: 'circle',
            cornerSize: 9,
            selectable: false,
            scaleX: obj.scaleX! * scaleX,
            scaleY: obj.scaleY! * scaleY,
            left: obj.left! * scaleX,
            top: obj.top! * scaleY
          });

          // カスタムコントロールを設定
          const customControls = {
            tl: fabric.Object.prototype.controls.tl, // 左上
            tr: fabric.Object.prototype.controls.tr, // 右上
            br: fabric.Object.prototype.controls.br, // 右下
            bl: fabric.Object.prototype.controls.bl, // 左下
            mtr: fabric.Object.prototype.controls.mtr // ローテーション
          };

          obj.controls = customControls;
        });

        // グリッドを描画
        drawGrid(canvas);
      });

      // キャンバスを再描画するバインド関数
      canvas.renderAll.bind(canvas);
    } else {
      // グリッドを描画
      await drawGrid(canvas);
    }

    // TODO: 非同期処理の問題を回避するため、setTimeoutを使用
    setTimeout(() => {
      saveState(); // 初期状態を保存
    }, 500);
  };

  useEffect(() => {
    if (canvas) {
      // キャンバスの初期設定とイベントリスナーの追加
      loadJson(canvas);
      canvas.on('object:modified', saveState);
      canvas.on('object:moving', handleObjectMoving);
      canvas.on('object:scaling', handleObjectScaling);
      canvas.on('object:added', handleObjectAdded);
      canvas.on('selection:cleared', handleSelectionClear);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
      canvas.on('mouse:down', handleMouseDown);

      // クリーンアップ処理: イベントリスナーの削除
      return () => {
        canvas.off('object:modified', saveState);
        canvas.off('selection:cleared', handleSelectionClear);
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
        canvas.off('mouse:down', handleMouseDown);
        canvas.off('object:moving', handleObjectMoving);
        canvas.off('object:scaling', handleObjectScaling);
        canvas.off('object:added', handleObjectAdded);
      };
    }
  }, [canvas]);

  return {
    bubbleRef,
    bubbleMenuPosition,
    setBubbleMenuPosition,
    selectObject,
    setSelectObject,
    undoStack,
    setUndoStack,
    redoStack,
    setRedoStack,
    continuous,
    setContinuous,
    isMobile,
    MAX_HISTORY,
    saveState,
    constrainViewport,
    containerRef,
    canvasWidth,
    canvasHeight,
    canvas,
    gridLines,
    setGridLines,
    drawGrid,
    canvasRef,
    addToStack,
    restoreGridProperties,
    loading,
    setLoading,
    size
  };
}
