'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import BubbleMenu from '@/components/fablic/BubbleMenu/BubbleMenu';
import Menu from '@/components/fablic/fixedMenu/Menu';
import ExpansionBtns from './ExpansionBtns/ExpansionBtns';
import { useTheme } from '@mui/material';
import RedoBtn from './fixedMenu/defaultMenu/RedoBtn';
import UndoBtn from './fixedMenu/defaultMenu/UndoBtn';

interface CustomLineOptions extends fabric.ILineOptions {
  isGrid?: boolean;
}

interface EditorProps {
  aspectRatio: number;
  keep: {
    uuid: string;
    title: string;
    fabric_object: fabric.Object; // fabric_objectがnullになる可能性も考慮
    width: number;
    height: number;
  } | null;
}

const Editor: React.FC<EditorProps> = ({ aspectRatio, keep }) => {
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
  const [canvasWidth, setCanvasWidth] = useState<number>(0)
  const [canvasHeight, setCanvasHeight] = useState<number>(0)
  const isDraggingRef = useRef(false);
  const lastPosXRef = useRef(0);
  const lastPosYRef = useRef(0);
  const theme = useTheme()
  const [windowSize, setWindowSize] = useState<{ WindowWidth: number | undefined, WindowHeight: number | undefined }>({
    WindowWidth: undefined,
    WindowHeight: undefined,
  });
  const [isMobail, setIsMobail] = useState(true)
  const maxHistory = 10;

  useEffect(() => {
    // ウィンドウのサイズを取得する関数
    const handleResize = () => {
      setWindowSize({
        WindowWidth: window.innerWidth,
        WindowHeight: window.innerHeight,
      });
    };

    setIsMobail(window.innerWidth < window.innerHeight)

    // リサイズイベントを設定
    window.addEventListener('resize', handleResize);

    // 初期サイズを設定
    handleResize();

    // クリーンアップ関数
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const saveState = useCallback(() => {
    if (canvas) {
      const json = canvas.toJSON(['isGrid']);
      setUndoStack(prevUndoStack => [...prevUndoStack, JSON.stringify(json)]);
      setContinuous(false);
      setRedoStack([]);
    }
  }, [canvas, setUndoStack, setContinuous, setRedoStack]);

  useEffect(() => {
    if (containerRef.current && windowSize.WindowWidth && windowSize.WindowHeight) {

      if (windowSize.WindowWidth < windowSize.WindowHeight) {
        const offsetWidth = containerRef.current.clientWidth;
        const offsetHeight = offsetWidth / aspectRatio;

        setCanvasHeight(offsetHeight);
        setCanvasWidth(offsetWidth);
      } else {
        const offsetHeight = containerRef.current.offsetHeight;
        const offsetWidth = offsetHeight * aspectRatio;

        setCanvasHeight(offsetHeight);
        setCanvasWidth(offsetWidth);
      }
    }
  }, [containerRef, windowSize, isMobail])


  useEffect(() => {
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
  }, [keep, canvasWidth, canvasHeight]);



  useEffect(() => {
    // Setup object:modified event listener
    if (canvas) {

      // Draw grid
      // Load JSON data if available
      // 画像オブジェクトをFabric.jsの形式に変換する関数
      if (keep) {
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

      const handleMouseMove = (opt: fabric.IEvent) => {
        if (isDraggingRef.current) {
          const e = opt.e as MouseEvent;
          const vpt = canvas.viewportTransform;
          if (vpt && lastPosXRef.current !== undefined && lastPosYRef.current !== undefined) {
            vpt[4] += e.clientX - lastPosXRef.current;
            vpt[5] += e.clientY - lastPosYRef.current;
            constrainViewport();
            canvas.requestRenderAll();
            lastPosXRef.current = e.clientX;
            lastPosYRef.current = e.clientY;
          }
        }
      };


      const handleMouseUp = (e: fabric.IEvent) => {
        const object = e.target as fabric.Textbox
        if (object) {
          object.selectable = true;
          canvas.setActiveObject(object)
          canvas.renderAll()
        }
        isDraggingRef.current = false
      };

      const handleSelectionClear = (e: fabric.IEvent) => {
        const objects = e.deselected as Array<fabric.Object>
        objects.map((obj) => {
          obj.selectable = false
        })
      }

      const handleMouseDown = (opt: fabric.IEvent) => {
        const activeObj = canvas.getActiveObject()
        if (!activeObj) {
          isDraggingRef.current = true
          const e = opt.e as MouseEvent
          lastPosXRef.current = e.clientX;
          lastPosYRef.current = e.clientY;
        }
      }



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
      };
    }
  }, [canvas, saveState]);

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
    const canvasHeight = canvas.getHeight(); // キャンバスの高さを取得
    const gridSize = canvasHeight / 4; // キャンバスの高さを4分割したサイズをグリッドサイズとする
    const canvasWidth = canvas.getWidth(); // キャンバスの幅を取得
    const lines: fabric.Line[] = [];

    // 垂直線を描画
    for (let i = 0; i <= canvasWidth / gridSize; i++) {
      const vertical = new fabric.Line(
        [i * gridSize, 0, i * gridSize, canvasHeight],
        { stroke: '#ccc', selectable: false, evented: false, isGrid: true } as CustomLineOptions
      );
      lines.push(vertical);
      canvas.add(vertical);
      vertical.moveTo(0);
    }

    // 水平線を描画
    for (let i = 0; i <= canvasHeight / gridSize; i++) {
      const horizontal = new fabric.Line(
        [0, i * gridSize, canvasWidth, i * gridSize],
        { stroke: '#ccc', selectable: false, evented: false, isGrid: true } as CustomLineOptions
      );
      lines.push(horizontal);
      canvas.add(horizontal);
      horizontal.moveTo(0);
    }

    setGridLines(lines);
  };



  return (
    <>
      <div className={`w-full ${isMobail ? 'h-[50vh]':'h-[75vh]'} flex justify-center items-center`}>
        <div className={`${isMobail ? 'h-fit w-full' : 'h-[90%] w-fit flex'}`}>

          <div ref={containerRef} className="size-full border border-solid border-black">
            <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
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
            width={canvasWidth}
            height={canvasHeight}
            keep={keep}
            isMobail={isMobail}
            maxHistory={maxHistory}
          />
          <div className={`${isMobail ? 'mt-3 justify-between' : 'h-full items-end'} flex pl-1`}>
            {isMobail &&
              <div className='flex'>
                <div className={`${undoStack.length === 0 ? 'bg-gray-500' :'bg-primary'} p-2`}>
                  <UndoBtn canvas={canvas} undoStack={undoStack} continuous={continuous} setContinuous={setContinuous}  setUndoStack={setUndoStack} setRedoStack={setRedoStack} maxHistory={maxHistory} isMobaile={isMobail} />
                </div>
                <div className={` ${redoStack.length === 0 ? 'bg-gray-500' : 'bg-primary'} p-2 ml-2`}>
                  <RedoBtn canvas={canvas} redoStack={redoStack} setUndoStack={setUndoStack} setRedoStack={setRedoStack} maxHistory={maxHistory} isMobaile={isMobail} />
                </div>
              </div>
            }
            <ExpansionBtns canvas={canvas} constrainViewport={constrainViewport} isMobaile={isMobail} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Editor;
