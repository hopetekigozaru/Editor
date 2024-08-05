'use client';
import React from 'react';
import BubbleMenu from '@/components/fablic/BubbleMenu/BubbleMenu';
import Menu from '@/components/fablic/fixedMenu/Menu';
import ExpansionBtns from './ExpansionBtns/ExpansionBtns';
import RedoBtn from './fixedMenu/defaultMenu/RedoBtn';
import UndoBtn from './fixedMenu/defaultMenu/UndoBtn';
import { useEditor } from '@/hooks/fabric/useEditor';
import { EditorProps } from '@/type/fabricType';

const Editor: React.FC<EditorProps> = ({ aspectRatio, keep }) => {
  const {
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
  } = useEditor(keep,aspectRatio)

  return (
    <>
      <div className={`w-full ${isMobile ? 'h-[50vh]' : 'h-[75vh]'} flex justify-center items-center relative`}>
        <div className={`${isMobile ? 'h-fit w-full' : 'h-[70%] w-fit flex'} fixed`}>

          <div ref={containerRef} className="border border-solid border-black">
            <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
          </div>
          <BubbleMenu
            canvas={canvas}
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
            saveState={saveState}
            containerElm={containerRef.current}
            canvasElm={canvasRef.current}
            bubbleElm={bubbleRef.current}
            setBubbleMenuPosition={setBubbleMenuPosition}
            setSelectObject={setSelectObject}
            selectObject={selectObject}
            gridLines={gridLines}
            setGridLines={setGridLines}
            drawGrid={drawGrid}
            keep={keep}
            isMobile={isMobile}
            MAX_HISTORY={MAX_HISTORY}
            addToStack={addToStack}
            restoreGridProperties={restoreGridProperties}
          />
          <div className={`${isMobile ? 'mt-3 justify-between' : 'h-full items-end'} flex pl-1`}>
            {isMobile &&
              <div className='flex'>
                <div className={`${undoStack.length === 0 ? 'bg-gray-500' : 'bg-primary'} p-2`}>
                  <UndoBtn canvas={canvas} undoStack={undoStack} continuous={continuous} setContinuous={setContinuous} setUndoStack={setUndoStack} setRedoStack={setRedoStack} isMobile ={isMobile} addToStack={addToStack} restoreGridProperties={restoreGridProperties} />
                </div>
                <div className={` ${redoStack.length === 0 ? 'bg-gray-500' : 'bg-primary'} p-2 ml-2`}>
                  <RedoBtn canvas={canvas} redoStack={redoStack} setUndoStack={setUndoStack} setRedoStack={setRedoStack} isMobile ={isMobile} addToStack={addToStack} restoreGridProperties={restoreGridProperties} />
                </div>
              </div>
            }
            <ExpansionBtns canvas={canvas} constrainViewport={constrainViewport} isMobile ={isMobile} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Editor;
