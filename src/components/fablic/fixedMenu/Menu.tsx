import React, { useEffect, useState, MouseEvent } from 'react';
import { fabric } from 'fabric';
import { Object } from 'fabric/fabric-impl';
import DefaultMenu from './defaultMenu/DefaultMenu';
import TextMenu from './textMenu/TextMenu';
import FontSizeMenu from './FontSizeMenu/FontSizeMenu';


interface MenuProps {
  canvas: fabric.Canvas | null;
  undoStack: string[];
  setUndoStack: React.Dispatch<React.SetStateAction<string[]>>;
  redoStack: string[];
  setRedoStack: React.Dispatch<React.SetStateAction<string[]>>;
  continuous: boolean;
  setContinuous: React.Dispatch<React.SetStateAction<boolean>>;
  activeObj: Object | null;
  saveState: () => void;
  containerElm: HTMLDivElement | null;
  canvasElm: HTMLCanvasElement | null;
  bubbleElm: HTMLDivElement | null;
  setBubbleMenuPosition: React.Dispatch<React.SetStateAction<{
    left: number | undefined;
    top: number | undefined;
  }>>;
  setSelectObject: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveObj: React.Dispatch<React.SetStateAction<fabric.Object | null>>;
  selectObject: boolean;
  gridLines: fabric.Line[];
  setGridLines: React.Dispatch<React.SetStateAction<fabric.Line[]>>;
  drawGrid: (canvas: fabric.Canvas) => void;
  width: number
  height: number
  keep: {
    id: number;
    title:string
    fabric_object: fabric.Object | null; // fabric_objectがnullになる可能性も考慮
    width: number;
    height: number;
  } | null;
}

const Menu = ({
  canvas,
  undoStack,
  setUndoStack,
  redoStack,
  setRedoStack,
  continuous,
  setContinuous,
  activeObj,
  saveState,
  containerElm,
  canvasElm,
  bubbleElm,
  setBubbleMenuPosition,
  setSelectObject,
  setActiveObj,
  selectObject,
  gridLines,
  setGridLines,
  drawGrid,
  width,
  height,
  keep
}: MenuProps) => {
  const [isFontSize, setIsFontSize] = useState<boolean>(false)
  const [isTextMenu, setIsTextMenu] = useState<boolean>(false)
  const maxHistory = 10;


  useEffect(() => {
    if (undoStack.length > maxHistory) {
      undoStack.shift();
    }
  }, [undoStack])


  const clickInput = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // クリックイベントをバブリングしないようにする
    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
    if (input) {
      input.click(); // ファイル入力要素に対してclick()を呼び出す
    }
  };

  const showBubbleMenu = (selectedObject: fabric.Object) => {
    const activeObj = canvas?.getActiveObject()
    if (canvasElm && bubbleElm && activeObj) {
      const canvasRect = canvasElm.getBoundingClientRect();
      const bubbleMenuHeight = bubbleElm ? bubbleElm.offsetHeight : 0;

      const boundingRect = selectedObject.getBoundingRect();
      let left = boundingRect.left + boundingRect.width + 10;
      let top = boundingRect.top + canvasRect.top - bubbleMenuHeight; // デフォルトの位置計算

      // 画面外に出た場合の調整
      if (top < 0) {
        top = boundingRect.top + canvasRect.top + boundingRect.height + 50; // 下に表示する
      }

      setBubbleMenuPosition({
        left: left + canvasRect.left,
        top: top,
      });
      setSelectObject(true);
    }
  };

  const handleSelectionCleared = () => {
    setActiveObj(null)
    setIsTextMenu(false)
    setIsFontSize(false)
    setSelectObject(false);
  };

  const handleSelectionCreatedOrUpdated = (e: fabric.IEvent) => {
    if (canvas) {

      let selectedObject = null;
      const activeObj = canvas.getActiveObject()
      setActiveObj(activeObj)

      if (activeObj?.type === 'textbox') {
        setIsTextMenu(true)
      }

      if (e.selected) {
        selectedObject = e.selected[0];
      } else if (e.target) {
        selectedObject = e.target;
      }
      if (selectedObject) {
        showBubbleMenu(selectedObject);
      }
    }
  };

  useEffect(() => {
    if (canvas && bubbleElm) {
      canvas.on('selection:updated', handleSelectionCreatedOrUpdated);
      canvas.on('selection:created', handleSelectionCreatedOrUpdated);
      canvas.on('selection:cleared', handleSelectionCleared);
      canvas.on('mouse:up', handleSelectionCreatedOrUpdated);
    }

    return () => {
      if (canvas) {
        canvas.off('selection:updated', handleSelectionCleared);
        canvas.off('selection:created', handleSelectionCleared);
        canvas.off('selection:cleared', handleSelectionCleared);
        canvas.off('mouse:up', handleSelectionCreatedOrUpdated);
      }
    }
  }, [canvas, bubbleElm, canvasElm, selectObject])


  return (
    <div className='fixed bottom-0 left-0 w-screen h-[12vh] bg-gray-900 flex justify-center items-center'>
      {(!isTextMenu && !isFontSize) &&
        <DefaultMenu
          canvas={canvas}
          gridLines={gridLines}
          setGridLines={setGridLines}
          containerElm={containerElm}
          drawGrid={drawGrid}
          undoStack={undoStack}
          setUndoStack={setUndoStack}
          saveState={saveState}
          setRedoStack={setRedoStack}
          maxHistory={maxHistory}
          setContinuous={setContinuous}
          clickInput={clickInput}
          continuous={continuous}
          redoStack={redoStack}
          width={width}
          height={height}
          keep={keep}
        />
      }
      {
        (isTextMenu && !isFontSize) &&
        <TextMenu
          canvas={canvas}
          activeObj={activeObj}
          saveState={saveState}
          clickInput={clickInput}
          setIsFontSize={setIsFontSize}
        />
      }
      {
        isFontSize &&
        <FontSizeMenu canvas={canvas} activeObj={activeObj as fabric.Textbox} saveState={saveState} setIsFontSize={setIsFontSize} />
      }
    </div>
  )
}

export default Menu