import { ChangeColorBtnProps } from '@/type/fabricType';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { debounce } from 'lodash';
import { ChangeEventHandler, MouseEvent, useState } from 'react';

const ChangeColorBtn = ({ canvas, clickInput, saveState  }: ChangeColorBtnProps) => {
  const [color, setColor] = useState('#000000');

  const debouncedColorState = debounce((color: string) => {
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (activeObj && activeObj.type === 'textbox') {
      activeObj.set({ fill: color });
      canvas.renderAll();
      setColor(color);
      saveState();
    }
  }, 100); // 1秒のデバウンス時間

  // カラーが変更されたときに呼び出される関数
  const handleColorChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    debouncedColorState(event.target.value); // debouncedSaveStateを呼び出す
  };

  return (
    <div>
      <input type="color" className='absolute opacity-0 w-0' value={color} onChange={(value) => handleColorChange(value)} />
      <button type='button' onClick={clickInput} className='hover:opacity-75'>
        <div>
          <ColorLensIcon  />
        </div>
        <div>
          <p className={'text-white'}>
            色
          </p>
        </div>
      </button>
    </div>
  )
}

export default ChangeColorBtn
