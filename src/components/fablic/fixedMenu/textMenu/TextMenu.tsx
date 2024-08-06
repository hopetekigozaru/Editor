
import React, { MouseEvent, useState } from 'react';
import ChangeColorBtn from './ChangeColorBtn';
import ChangeFontSizeBtn from './ChangeFontSizeBtn';
import ChangeFontBtn from './ChangeFontBtn';
import ChangeColorBtnMb from './ChangeColorBtnMb';
import ChangeFontSizeSliderMb from '../FontSizeMenu/FontSizeSliderMb';
import ChangeFontBtnMb from './ChangeFontBtnMb';
import { TextMenuProps } from '@/type/fabricType';
import { ColorPicker, IColor, useColor } from 'react-color-palette';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TextMenu = ({ canvas, saveState, clickInput, setIsFontSize, isMobile }: TextMenuProps) => {
  const [showPicker, setShowPicker] = useState<boolean>(false)
  const [colorPick, setColorPick] = useColor('#000000')

  const handleColorPicker = (e: IColor) => {
    setColorPick(e)
  }

  const handleChangeComplete = () => {
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (activeObj && activeObj.type === 'textbox') {
      console.log('hex')
      activeObj.set({ fill: colorPick.hex });
      canvas.renderAll();
    }
  }

  return (
    <div className={isMobile ? 'w-full' : 'w-full'}>
      {!showPicker &&
        <>
          <div className={`flex justify-center text-primary ${isMobile ? 'text-xl' : 'hidden'}  font-bold`} >
            <div>
              <p>テキストメニュー</p>
            </div>
          </div>
          {!isMobile &&
            <div className='w-full flex justify-center h-fit'>
              <div className='w-1/3 flex justify-between'>
                <ChangeColorBtn canvas={canvas} clickInput={clickInput} saveState={saveState} />
                <ChangeFontSizeBtn setIsFontSize={setIsFontSize} />
                <ChangeFontBtn canvas={canvas} saveState={saveState} />
              </div>
            </div>
          }
          {isMobile &&
            <div className='flex justify-center mt-5'>
              <div className='w-2/3'>
                <ChangeColorBtnMb canvas={canvas} clickInput={clickInput} saveState={saveState} setShowPicker={setShowPicker} colorPick={colorPick} />
                <ChangeFontSizeSliderMb canvas={canvas} saveState={saveState} />
                <ChangeFontBtnMb canvas={canvas} saveState={saveState} />
              </div>
            </div>
          }
        </>
      }
      {showPicker &&
        <div>
          <div className='flex justify-center items-center  mb-5'>
            <div className='flex w-2/3'>
              <button type='button' onClick={() => { setShowPicker(false) }}>
                <div className='flex justify-center'>
                  <ArrowBackIcon color='primary' fontSize='large' />
                </div>
              </button>
              <div className='w-full text-center text-primary text-2xl'>
                ColorPicker
              </div>
            </div>
          </div>
          <div className='size-full z-[99] left-0 top-0 flex justify-center items-center'>
            <div className='w-[80vw]'>
              <ColorPicker hideInput={["rgb", "hsv", "hex"]} color={colorPick} onChange={(e) => handleColorPicker(e)} onChangeComplete={handleChangeComplete} />
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default TextMenu
