import React, { useEffect, useState, MouseEvent, useRef } from 'react';
import { fabric } from 'fabric';
import { Object } from 'fabric/fabric-impl';
import DefaultMenu from './defaultMenu/DefaultMenu';
import TextMenu from './textMenu/TextMenu';
import FontSizeMenu from './FontSizeMenu/FontSizeMenu';
import { Box, CssBaseline, styled, SwipeableDrawer, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Global } from '@emotion/react';


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
    uuid: string;
    title: string
    fabric_object: fabric.Object | null; // fabric_objectがnullになる可能性も考慮
    width: number;
    height: number;
  } | null;
  isMobail: boolean
  MAX_HISTORY: number,
  addToStack: (stack: string[], item: string) => string[]
  restoreGridProperties: (canvas: fabric.Canvas) => void
}


const Root = styled('div')(({ theme }) => ({
  // height: '50%',
  backgroundColor:
    theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

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
  keep,
  isMobail,
  MAX_HISTORY,
  addToStack,
  restoreGridProperties
}: MenuProps) => {
  const [isFontSize, setIsFontSize] = useState<boolean>(false)
  const [isTextMenu, setIsTextMenu] = useState<boolean>(false)
  const [open, setOpen] = React.useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null)
  const theme = useTheme();
  const drawwerHeightRef = useRef<string>('')
  useEffect(() => {
    drawwerHeightRef.current = isMobail ? '42vh' : '17vh'
  }, [isMobail])


  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };



  useEffect(() => {
    if (undoStack.length > MAX_HISTORY) {
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
    const activeObj = canvas?.getActiveObject();
    if (canvasElm && bubbleElm && activeObj) {
      const canvasRect = canvasElm.getBoundingClientRect();
      const bubbleMenuHeight = bubbleElm ? bubbleElm.offsetHeight : 0;
      const bubbleMenuWidth = bubbleElm ? bubbleElm.offsetWidth : 0;

      const boundingRect = selectedObject.getBoundingRect();
      let left = boundingRect.left + boundingRect.width + 10;
      let top = boundingRect.top + canvasRect.top - bubbleMenuHeight; // デフォルトの位置計算

      // 上に出る場合の調整
      if (top < 0) {
        top = boundingRect.top + canvasRect.top + boundingRect.height + 10; // 下に表示する
      }

      // 左右の画面外に出た場合の調整
      if (left + bubbleMenuWidth > canvasRect.right) {
        left = canvasRect.right - bubbleMenuWidth - 10; // 画面右端に合わせる
      } else if (left < canvasRect.left) {
        left = canvasRect.left + 10; // 画面左端に合わせる
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
    setOpen(false)
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
        setOpen(true)
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
    <div ref={containerRef} className={`fixed bottom-0 left-0 w-screen ${isMobail ? 'h-[40vh]' : 'h-[15vh]'} bg-primary flex justify-center items-center rounded-tl-[5rem] rounded-tr-[5rem]`}>
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
        MAX_HISTORY={MAX_HISTORY}
        setContinuous={setContinuous}
        clickInput={clickInput}
        continuous={continuous}
        redoStack={redoStack}
        width={width}
        height={height}
        keep={keep}
        isMobail={isMobail}
        addToStack={addToStack}
        restoreGridProperties={restoreGridProperties}
      />
      {containerRef.current &&
        <Root>
          <CssBaseline />
          <Global
            styles={{
              '.MuiDrawer-root > .MuiPaper-root': {
                height: drawwerHeightRef.current,
                overflow: 'visible',
                borderTopLeftRadius: '5rem',
                borderTopRightRadius: '5rem',
                border: `2 solid ${theme.palette.primary.main}`

              },
              '.MuiModal-root': {
                height: '17vh'
              },
            }}
          />
          {containerRef.current && ( // containerRef.current が初期化されていることを確認
            <SwipeableDrawer
              // container={containerRef.current}
              anchor="bottom"
              open={open}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
              swipeAreaWidth={0}
              disableSwipeToOpen={false}
              disableBackdropTransition={true}
              hideBackdrop={true}
              ModalProps={{
                hideBackdrop: true,  // バックドロップを完全に無効にする
              }}

            >
              <Box
                sx={{
                  height: '100%',
                  overflow: 'auto',
                  backgroundColor: 'white',
                  borderTopLeftRadius: '5rem',
                  borderTopRightRadius: '5rem',
                  border: `2 solid ${theme.palette.primary.main}`
                }}
              >
                <div className='flex justify-center items-center h-full'>
                  {(!isFontSize && isTextMenu) &&
                    <TextMenu
                      canvas={canvas}
                      activeObj={activeObj}
                      saveState={saveState}
                      clickInput={clickInput}
                      setIsFontSize={setIsFontSize}
                      isMobail={isMobail}
                    />
                  }
                  {
                    (isFontSize && !isMobail) &&
                    <FontSizeMenu canvas={canvas} activeObj={activeObj as fabric.Textbox} saveState={saveState} setIsFontSize={setIsFontSize} />
                  }
                </div>
              </Box>
            </SwipeableDrawer>
          )}
        </Root>
      }

    </div>
  )
}

export default Menu
