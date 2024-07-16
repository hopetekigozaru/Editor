
import React, { MouseEvent } from 'react';
import { fabric } from 'fabric';
import { Object } from 'fabric/fabric-impl';
import ChangeColorBtn from './ChangeColorBtn';
import ChangeFontSizeBtn from './ChangeFontSizeBtn';
import ChangeFontBtn from './ChangeFontBtn';
import ChangeColorBtnMb from './ChangeColorBtnMb';
import ChangeFontSizeSliderMb from '../FontSizeMenu/FontSizeSliderMb';
import ChangeFontBtnMb from './ChangeFontBtnMb';

interface TextMenuProps {
  canvas: fabric.Canvas | null;
  activeObj: Object | null;
  saveState: () => void;
  clickInput: (e: MouseEvent<HTMLButtonElement>) => void
  setIsFontSize: React.Dispatch<React.SetStateAction<boolean>>
  isMobail: boolean
}

const TextMenu = ({ canvas, activeObj, saveState, clickInput, setIsFontSize, isMobail }: TextMenuProps) => {

  return (
    <div className={isMobail ? 'w-full' : 'w-full'}>
      <div className={`flex justify-center text-primary ${isMobail? 'text-xl':'hidden'}  font-bold`} >
        <div>
          <p>テキストメニュー</p>
        </div>
      </div>
      {!isMobail &&
        <div className='w-full flex justify-center h-fit'>
          <div className='w-1/3 flex justify-between'>
            <ChangeColorBtn canvas={canvas} activeObj={activeObj as fabric.Textbox | undefined} clickInput={clickInput} saveState={saveState} />
            <ChangeFontSizeBtn setIsFontSize={setIsFontSize} />
            <ChangeFontBtn canvas={canvas} activeObj={activeObj} saveState={saveState} />
          </div>
        </div>
      }
      {isMobail &&
        <div className='flex justify-center mt-5'>
          <div className='w-2/3'>
            <ChangeColorBtnMb canvas={canvas} activeObj={activeObj as fabric.Textbox | undefined} clickInput={clickInput} saveState={saveState} />
            <ChangeFontSizeSliderMb canvas={canvas} activeObj={activeObj as fabric.Textbox} saveState={saveState} />
            <ChangeFontBtnMb canvas={canvas} activeObj={activeObj} saveState={saveState}/>
          </div>
        </div>
      }
    </div>
  )
}

export default TextMenu
