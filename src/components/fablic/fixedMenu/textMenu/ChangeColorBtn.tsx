import ColorLensIcon from '@mui/icons-material/ColorLens';
import { debounce } from 'lodash';
import { ChangeEventHandler, MouseEvent, useState } from 'react';

interface ChangeColorBtnProps {
  canvas: fabric.Canvas | null;
  activeObj: fabric.Textbox | undefined;
  clickInput: (e: MouseEvent<HTMLButtonElement>) => void
  saveState: () => void;
}

const ChangeColorBtn = ({ canvas, activeObj, clickInput, saveState }: ChangeColorBtnProps) => {
  const [color, setColor] = useState('#000000');

  const debouncedColorState = debounce((color: string) => {
    if (!canvas) return;
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
      <button type='button' onClick={clickInput}>
        <div>
          <ColorLensIcon />
        </div>
        <div>
          <p className='text-xs'>
            色
          </p>
        </div>
      </button>
    </div>
  )
}

export default ChangeColorBtn