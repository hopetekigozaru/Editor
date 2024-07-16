'use client';
import React from 'react';
import { fabric } from 'fabric-with-gestures';
import BubbleMenu from '@/components/fablic/BubbleMenu/BubbleMenu';
import Menu from '@/components/fablic/fixedMenu/Menu';
import ExpansionBtns from './ExpansionBtns/ExpansionBtns';
import RedoBtn from './fixedMenu/defaultMenu/RedoBtn';
import UndoBtn from './fixedMenu/defaultMenu/UndoBtn';
import { useEditor } from '@/hooks/fabric/useEditor';




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
const {
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
}  = useEditor(aspectRatio,keep)

  return (
    <>
      <div className={`w-full ${isMobail ? 'h-[50vh]' : 'h-[75vh]'} flex justify-center items-center`}>
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
                <div className={`${undoStack.length === 0 ? 'bg-gray-500' : 'bg-primary'} p-2`}>
                  <UndoBtn canvas={canvas} undoStack={undoStack} continuous={continuous} setContinuous={setContinuous} setUndoStack={setUndoStack} setRedoStack={setRedoStack} maxHistory={maxHistory} isMobaile={isMobail} />
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
