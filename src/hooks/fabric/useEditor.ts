'use client'
import { useTheme } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric-with-gestures';
import { useEvent } from './useEvent';
import { useInitCanvas } from './useInitCanvas';
import { keep } from '@/type/fabricType';

export const useEditor = (keep: keep | null, aspectRatio: number) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [bubbleMenuPosition, setBubbleMenuPosition] = useState<{ left: number | undefined; top: number | undefined }>({ left: 0, top: 0 });
  const [selectObject, setSelectObject] = useState<boolean>(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [continuous, setContinuous] = useState<boolean>(false);
  const theme = useTheme()
  const MAX_HISTORY = 50; // 履歴の最大数
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
  } = useInitCanvas(aspectRatio)

  const {
    handleObjectMoving,
    handleObjectScaling,
    handleObjectAdded,
    handleMouseMove,
    handleMouseUp,
    handleSelectionClear,
    handleMouseDown,
    constrainViewport,
  } = useEvent(canvas, isMobile)


  /**
   * グリッドのプロパティを復元する関数
   * @param canvas キャンバスオブジェクト
   */
  const restoreGridProperties = (canvas: fabric.Canvas) => {
    canvas.getObjects().forEach((obj) => {
      if ((obj as any).isGrid) {
        obj.set({ selectable: false, evented: false });
      }
    });
  };

  /**
   * スタックに追加する関数（最大履歴数を考慮）
   * @param stack 現在の履歴
   * @param item 追加する履歴
   * @returns 新しい履歴
   */
  const addToStack = (stack: string[], item: string) => {
    const newStack = [...stack, item];
    return newStack.slice(-MAX_HISTORY);
  };


  /**
   * 状態を保存する関数
   */
  const saveState = useCallback(() => {
    if (canvas) {
      const currentState = JSON.stringify(canvas.toJSON(['isGrid']));
      // 直前の状態と比較して変更がある場合のみ保存
      if (undoStack.length === 0 || currentState !== undoStack[undoStack.length - 1]) {
        setUndoStack(prevStack => addToStack(prevStack, currentState));
        setRedoStack([]); // Redoスタックをクリア
      }
    }
  }, [canvas, undoStack]);

  /**
   * JsonObject復元関数
   * @param canvas
   */
  const loadJson = async (canvas: fabric.Canvas) => {
    if (keep) {
      // Jsonをfabricオブジェクトに復元
      canvas.loadFromJSON(keep!.fabric_object, () => {
        canvas.forEachObject(obj => {
          if (obj.type === 'textbox') {
            obj as fabric.Textbox
            obj.set({
              borderColor: theme.palette.secondary.main,  // 枠線の色
              cornerColor: theme.palette.secondary.main,  // コーナーの色
              cornerStyle: 'circle',
              cornerSize: 9,
              selectable: false,
            });
          }
        });
      })
      await drawGrid(canvas);
      canvas.renderAll.bind(canvas)
    } else {
      await drawGrid(canvas)
    }
    saveState(); // Save initial state
  }

  useEffect(() => {
    if (canvas) {
      loadJson(canvas)
      canvas.on('object:modified', saveState);
      canvas.on('object:moving', handleObjectMoving);
      canvas.on('object:scaling', handleObjectScaling);
      canvas.on('object:added', handleObjectAdded);
      canvas.on('selection:cleared', handleSelectionClear)
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
      canvas.on('mouse:down', handleMouseDown);


      return () => {
        canvas.off('object:modified', saveState); // Cleanup
        canvas.off('selection:cleared', handleSelectionClear)
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
    restoreGridProperties
  }

}