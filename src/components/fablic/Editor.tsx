'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import BubbleMenu from '@/components/fablic/BubbleMenu/BubbleMenu';
import Menu from '@/components/fablic/fixedMenu/Menu';
import ExpansionBtns from './ExpansionBtns/ExpansionBtns';

interface CustomLineOptions extends fabric.ILineOptions {
  isGrid?: boolean;
}

interface EditorProps {
  width: number;
  height: number;
  keep: {
    uuid: string;
    title: string;
    fabric_object: fabric.Object; // fabric_objectがnullになる可能性も考慮
    width: number;
    height: number;
  } | null;
}

const Editor: React.FC<EditorProps> = ({ width, height, keep }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [bubbleMenuPosition, setBubbleMenuPosition] = useState<{ left: number | undefined; top: number | undefined }>({ left: 0, top: 0 });
  const [selectObject, setSelectObject] = useState<boolean>(false);
  const [gridLines, setGridLines] = useState<fabric.Line[]>([]);
  const [activeObj, setActiveObj] = useState<fabric.Object | null>(null);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [continuous, setContinuous] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastPosX, setLastPosX] = useState<number | undefined>(undefined);
  const [lastPosY, setLastPosY] = useState<number | undefined>(undefined);

  const saveState = useCallback(() => {
    if (canvas) {
      const json = canvas.toJSON(['isGrid']);
      setUndoStack(prevUndoStack => [...prevUndoStack, JSON.stringify(json)]);
      setContinuous(false);
      setRedoStack([]);
    }
  }, [canvas, setUndoStack, setContinuous, setRedoStack]);


  useEffect(() => {
    const canvasElm = canvasRef.current;
    if (!canvasElm) return;


    const canvasInstance = new fabric.Canvas(canvasElm);
    setCanvas(canvasInstance);

    // Enable selection
    canvasInstance.selection = true;


    // Cleanup on unmount
    return () => {
      if (canvasInstance) {
        canvasInstance.dispose();
      }
    };
  }, [keep]);



  useEffect(() => {
    // Setup object:modified event listener
    if (canvas) {
      // Draw grid
      // Load JSON data if available
      // 画像オブジェクトをFabric.jsの形式に変換する関数
      if (keep && canvas) {
        canvas.clear();
        canvas.loadFromJSON(keep!.fabric_object, () => {
          drawGrid(canvas);
          canvas.renderAll.bind(canvas)
        })
      } else {
        drawGrid(canvas)
      }
      saveState(); // Save initial state
      canvas.on('object:modified', saveState);

      // Function to constrain viewport within canvas boundaries
      const handleMouseDown = (opt: fabric.IEvent) => {
        const evt = opt.e as MouseEvent;
        if (evt.shiftKey) {
          canvas._objects.map((obj) => {
            obj.lockMovementX = true
            obj.lockMovementY = true
          })
          canvas.discardActiveObject();
          canvas.selection = false;
          setIsDragging(true);
          setLastPosX(evt.clientX);
          setLastPosY(evt.clientY);
        } else {
          setIsDragging(false);
          canvas.selection = true;
          const activeObj = canvas.getActiveObject();
          if (activeObj) {
            const length = canvas._objects.length;
            activeObj.moveTo(length - 1)
          }
        }
      };

      const handleMouseMove = (opt: fabric.IEvent) => {
        if (isDragging) {
          const e = opt.e as MouseEvent;
          const vpt = canvas.viewportTransform;
          if (vpt && lastPosX !== undefined && lastPosY !== undefined) {
            vpt[4] += e.clientX - lastPosX;
            vpt[5] += e.clientY - lastPosY;
            constrainViewport();
            canvas.requestRenderAll();
            setLastPosX(e.clientX);
            setLastPosY(e.clientY);
          }
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        canvas.selection = true;
        canvas._objects.map((obj) => {
          obj.lockMovementX = false
          obj.lockMovementY = false
        })
      };


      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);

      return () => {
        canvas.off('object:modified', saveState); // Cleanup
        canvas.off('mouse:down', handleMouseDown);
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
      };
    }
  }, [canvas, saveState, isDragging, lastPosX, lastPosY]);

  const constrainViewport = () => {
    if (canvas) {
      const vpt = canvas.viewportTransform;
      if (vpt) {
        // X方向の制限
        if (vpt[4] > 0) vpt[4] = 0;  // 左端
        const maxX = canvas.width! - canvas.getWidth() * vpt[0];
        if (vpt[4] < maxX) vpt[4] = maxX;  // 右端

        // Y方向の制限
        if (vpt[5] > 0) vpt[5] = 0;  // 上端
        const maxY = canvas.height! - canvas.getHeight() * vpt[3];
        if (vpt[5] < maxY) vpt[5] = maxY;  // 下端

        // Canvasに変更を反映
        canvas.setViewportTransform(vpt);
      }
    }
  };

  const drawGrid = (canvas: fabric.Canvas) => {
    const gridSize = 100;
    const lines: fabric.Line[] = [];

    for (let i = 0; i <= (canvas.width ?? 0) / gridSize; i++) {
      const vertical = new fabric.Line(
        [i * gridSize, 0, i * gridSize, canvas.height ?? 0],
        { stroke: '#ccc', selectable: false, evented: false, isGrid: true } as CustomLineOptions
      );
      lines.push(vertical);
      canvas.add(vertical);
      vertical.moveTo(0)
    }

    for (let i = 0; i <= (canvas.height ?? 0) / gridSize; i++) {
      const horizontal = new fabric.Line(
        [0, i * gridSize, canvas.width ?? 0, i * gridSize],
        { stroke: '#ccc', selectable: false, evented: false, isGrid: true } as CustomLineOptions
      );
      lines.push(horizontal);
      canvas.add(horizontal);
      horizontal.moveTo(0)
    }


    setGridLines(lines);
  };



  return (
    <>
      <div className="w-full h-[78vh] flex justify-center items-center">
        <div className="flex">

          <div ref={containerRef} className="size-fit border border-solid border-black">
            <canvas ref={canvasRef} width={width} height={height} />
          </div>
          <BubbleMenu
            canvas={canvas}
            activeObj={activeObj}
            saveState={saveState}
            bubbleRef={bubbleRef}
            selectObject={selectObject}
            bubbleMenuPosition={bubbleMenuPosition}
          />
          <Menu
            canvas={canvas}
            undoStack={undoStack}
            setUndoStack={setUndoStack}
            redoStack={redoStack}
            setRedoStack={setRedoStack}
            continuous={continuous}
            setContinuous={setContinuous}
            activeObj={activeObj}
            saveState={saveState}
            containerElm={containerRef.current}
            canvasElm={canvasRef.current}
            bubbleElm={bubbleRef.current}
            setBubbleMenuPosition={setBubbleMenuPosition}
            setSelectObject={setSelectObject}
            setActiveObj={setActiveObj}
            selectObject={selectObject}
            gridLines={gridLines}
            setGridLines={setGridLines}
            drawGrid={drawGrid}
            width={width}
            height={height}
            keep={keep}
          />
          <ExpansionBtns canvas={canvas} constrainViewport={constrainViewport} />
        </div>
      </div>
      <div className="w-screen h-[12vh]"></div>
    </>
  );
};

export default Editor;
