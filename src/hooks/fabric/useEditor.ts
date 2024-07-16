import { useTheme } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric-with-gestures';
import { useEvent } from './useEvent';
import { useInitCanvas } from './useInitCanvas';

interface keep {
  uuid: string;
  title: string;
  fabric_object: fabric.Object; // fabric_objectがnullになる可能性も考慮
  width: number;
  height: number;
}



export const useEditor = (aspectRatio: number, keep: keep | null) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [bubbleMenuPosition, setBubbleMenuPosition] = useState<{ left: number | undefined; top: number | undefined }>({ left: 0, top: 0 });
  const [selectObject, setSelectObject] = useState<boolean>(false);
  const [activeObj, setActiveObj] = useState<fabric.Object | null>(null);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [continuous, setContinuous] = useState<boolean>(false);
  const {canvas,isMobail,canvasRef,containerRef,canvasWidth,canvasHeight,drawGrid,setGridLines,gridLines} = useInitCanvas(aspectRatio)
  const theme = useTheme()
  const maxHistory = 10;

  // 変更履歴を保存する関数
  const saveState = useCallback(() => {
    if (canvas) {
      const json = canvas.toJSON(['isGrid']);
      setUndoStack(prevUndoStack => [...prevUndoStack, JSON.stringify(json)]);
      setContinuous(false);
      setRedoStack([]);
    }
  }, [canvas, setUndoStack, setContinuous, setRedoStack]);

  const {
    handleObjectMove,
    handleMouseMove,
    handleMouseUp,
    handleSelectionClear,
    handleMouseDown,
    constrainViewport
  } = useEvent(canvas,isMobail, saveState)

  useEffect(() => {
    if (canvas) {
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
          drawGrid(canvas);
          canvas.renderAll.bind(canvas)
        })
      } else {
        drawGrid(canvas)
      }
      saveState(); // Save initial state
      canvas.on('object:modified', saveState);
      canvas.on('selection:cleared', handleSelectionClear)
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
      canvas.on('mouse:down',handleMouseDown);
      canvas.on('object:moving',handleObjectMove)


      return () => {
        canvas.off('object:modified', saveState); // Cleanup
        canvas.off('selection:cleared', handleSelectionClear)
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
        canvas.off('mouse:down',handleMouseDown);
      };
    }
  }, [canvas, drawGrid, handleMouseDown, handleMouseMove, handleMouseUp, handleObjectMove, handleSelectionClear, keep, saveState, theme.palette.secondary.main]);

  return {
    canvasRef,
    containerRef,
    bubbleRef,
    canvas,
    bubbleMenuPosition,
    setBubbleMenuPosition,
    selectObject,
    setSelectObject,
    gridLines,
    setGridLines,
    activeObj,
    setActiveObj,
    undoStack,
    setUndoStack,
    redoStack,
    setRedoStack,
    continuous,
    setContinuous,
    canvasWidth,
    canvasHeight,
    isMobail,
    maxHistory,
    saveState,
    drawGrid,
    constrainViewport
  }

}