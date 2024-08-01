
import React, { MouseEvent } from 'react';
import ChangeColorBtn from './ChangeColorBtn';
import ChangeFontSizeBtn from './ChangeFontSizeBtn';
import ChangeFontBtn from './ChangeFontBtn';
import ChangeColorBtnMb from './ChangeColorBtnMb';
import ChangeFontSizeSliderMb from '../FontSizeMenu/FontSizeSliderMb';
import ChangeFontBtnMb from './ChangeFontBtnMb';
import { TextMenuProps } from '@/type/fabricType';

const TextMenu = ({ canvas, saveState, clickInput, setIsFontSize, isMobile }: TextMenuProps) => {

  return (
    <div className={isMobile ? 'w-full' : 'w-full'}>
      <div className={`flex justify-center text-primary ${isMobile? 'text-xl':'hidden'}  font-bold`} >
        <div>
          <p>テキストメニュー</p>
        </div>
      </div>
      {!isMobile &&
        <div className='w-full flex justify-center h-fit'>
          <div className='w-1/3 flex justify-between'>
            <ChangeColorBtn canvas={canvas} clickInput={clickInput} saveState={saveState}/>
            <ChangeFontSizeBtn setIsFontSize={setIsFontSize} />
            <ChangeFontBtn canvas={canvas} saveState={saveState} />
          </div>
        </div>
      }
      {isMobile &&
        <div className='flex justify-center mt-5'>
          <div className='w-2/3'>
            <ChangeColorBtnMb canvas={canvas} clickInput={clickInput} saveState={saveState} />
            <ChangeFontSizeSliderMb canvas={canvas} saveState={saveState} />
            <ChangeFontBtnMb canvas={canvas}  saveState={saveState}/>
          </div>
        </div>
      }
    </div>
  )
}

export default TextMenu
