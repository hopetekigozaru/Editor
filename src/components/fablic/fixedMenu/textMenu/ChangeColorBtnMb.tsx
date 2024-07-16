import ColorLensIcon from '@mui/icons-material/ColorLens';
import { debounce } from 'lodash';
import { ChangeEventHandler, MouseEvent, useState } from 'react';

interface ChangeColorBtnMbProps {
  canvas: fabric.Canvas | null;
  activeObj: fabric.Textbox | undefined;
  clickInput: (e: MouseEvent<HTMLButtonElement>) => void
  saveState: () => void;
}

const ChangeColorBtnMb = ({ canvas, activeObj, clickInput, saveState }: ChangeColorBtnMbProps) => {
  const [color, setColor] = useState('#000000');
  const [paretColor, setParetColor] = useState('linear-gradient(to right, #f56565, #a78bfa, #3b82f6)');

  const debouncedColorState = debounce((color: string) => {
    if (!canvas) return;
    if (activeObj && activeObj.type === 'textbox') {
      activeObj.set({ fill: color });
      canvas.renderAll();
      setColor(color);
      setParetColor(color)
      saveState();
    }
  }, 100); // 1秒のデバウンス時間

  // カラーが変更されたときに呼び出される関数
  const handleColorChange = (color: string) => {
    debouncedColorState(color); // debouncedSaveStateを呼び出す
  };

  return (
    <>
      <div className='text-primary'>
        テキストカラー
      </div>
      <div className='flex justify-between w-full mt-1'>
        <button className='w-[1.5rem] h-[1.5rem] rounded-full border-2 border-solid border-gray-300' onClick={() => handleColorChange('#000000')}>
          <div className='bg-black w-full h-full rounded-full'></div>
        </button>
        <button className='w-[1.5rem] h-[1.5rem] rounded-full border-2 border-solid border-gray-300' onClick={() => handleColorChange('#ffffff')}>
          <div className='bg-white w-full h-full rounded-full'></div>
        </button>
        <button className='w-[1.5rem] h-[1.5rem] rounded-full border-2 border-solid border-gray-300' onClick={() => handleColorChange('#ef4444')}>
          <div className='bg-red-500 w-full h-full rounded-full'></div>
        </button>
        <button className='w-[1.5rem] h-[1.5rem] rounded-full border-2 border-solid border-gray-300' onClick={() => handleColorChange('#3b82f6')}>
          <div className='bg-blue-500 w-full h-full rounded-full'></div>
        </button>
        <button className='w-[1.5rem] h-[1.5rem] rounded-full border-2 border-solid border-gray-300' onClick={() => handleColorChange('#22c55e')}>
          <div className='bg-green-500 w-full h-full rounded-full'></div>
        </button>
        <button className='w-[1.5rem] h-[1.5rem] rounded-full border-2 border-solid border-gray-300' onClick={() => handleColorChange('#eab308')}>
          <div className='bg-yellow-500 *:w-full h-full rounded-full'></div>
        </button>
        <div>
          <input type="color" className='absolute opacity-0 w-0 -top-[10%] left-[25%]' value={color} onChange={(value) => handleColorChange(value.target.value)} />
          <button type='button' onClick={clickInput} className='w-[1.5rem] h-[1.5rem] rounded-full border-2 border-solid border-gray-300'>
            <div className={`w-full h-full rounded-full`} style={{background: paretColor}} ></div>
          </button>
        </div>
      </div>
    </>
  )
}

export default ChangeColorBtnMb
