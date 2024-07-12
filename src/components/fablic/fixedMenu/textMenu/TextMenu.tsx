
import React, { MouseEvent } from 'react';
import { fabric } from 'fabric';
import { Object } from 'fabric/fabric-impl';
import ChangeColorBtn from './ChangeColorBtn';
import ChangeFontSizeBtn from './ChangeFontSizeBtn';
import ChangeFontBtn from './ChangeFontBtn';

interface TextMenuProps {
  canvas: fabric.Canvas | null;
  activeObj: Object | null;
  saveState: () => void;
  clickInput: (e: MouseEvent<HTMLButtonElement>) => void
  setIsFontSize: React.Dispatch<React.SetStateAction<boolean>>
}

const TextMenu = ({ canvas, activeObj, saveState, clickInput, setIsFontSize }: TextMenuProps) => {

  return (
    <div className='w-1/3 flex justify-between h-fit'>
      <ChangeColorBtn canvas={canvas} activeObj={activeObj as fabric.Textbox | undefined} clickInput={clickInput} saveState={saveState} />
      <ChangeFontSizeBtn setIsFontSize={setIsFontSize} />
      <ChangeFontBtn canvas={canvas} activeObj={activeObj} saveState={saveState} />
    </div>
  )
}

export default TextMenu