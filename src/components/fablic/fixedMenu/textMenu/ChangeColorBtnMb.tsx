import { ChangeColorBtnMbProps } from '@/type/fabricType';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import "react-color-palette/css";

const ChangeColorBtnMb = ({ canvas, clickInput, saveState, setShowPicker, colorPick }: ChangeColorBtnMbProps) => {
  const [color, setColor] = useState('#000000');
  const [paretColor, setParetColor] = useState('linear-gradient(to right, #f56565, #a78bfa, #3b82f6)');

  useEffect(() => {
    setColor(colorPick.hex)
    setParetColor(colorPick.hex)
  }, [colorPick])

  useEffect(() => {
    debouncedColorState(color)
  }, [color])

  const debouncedColorState = debounce((color: string) => {
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (activeObj && activeObj.type === 'textbox') {
      activeObj.set({ fill: color });
      canvas.renderAll();
      saveState();
    }
  }, 100); // 1秒のデバウンス時間

  // カラーが変更されたときに呼び出される関数
  const handleColorChange = (color: string) => {
    setColor(color); // debouncedSaveStateを呼び出す
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
        {/* TODO スマホだとカラーパレットが表示されない */}
        <div>
          <button type='button' onClick={() => setShowPicker(true)} className='w-[1.5rem] h-[1.5rem] rounded-full border-2 border-solid border-gray-300'>
            <div className={`w-full h-full rounded-full`} style={{ background: paretColor }} ></div>
          </button>
        </div>
      </div>
    </>
  )
}

export default ChangeColorBtnMb
