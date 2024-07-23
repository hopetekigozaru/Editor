import { Slider } from "@mui/material"
import { debounce } from "lodash";
import { useState } from "react";
interface ChangeFontSizeSliderProps {
  canvas: fabric.Canvas | null;
  activeObj: fabric.Textbox | undefined;
  saveState: () => void;
}
const ChangeFontSizeSlider = ({ canvas, activeObj, saveState }: ChangeFontSizeSliderProps) => {
  const size = activeObj?.fontSize as number
  const [fontSize, setFontSize] = useState<number>(size);

  const debouncedFontSizeChange = debounce((fontSize: number) => {
    if (!canvas || !activeObj) return;
    if (activeObj.type === 'textbox') {
      const activeObject = activeObj
      setFontSize(fontSize);
      activeObject.set({ fontSize });
      activeObj.set('width', activeObj.minWidth); // 幅をリセット
      activeObj.setCoords(); // 座標を更新
      canvas.renderAll();
      saveState();
    }
  }, 50); // 100ミリ秒のデバウンス時間

  const handleFontSizeChange = (event: Event, value: number | number[], activeThumb: number) => {
    console.log(value)
    const newSize = value as number;
    debouncedFontSizeChange(newSize); // デバウンスされた関数を呼び出す
  };
  return (
    <>
      <div className='w-1/3 flex items-center'>
        <Slider value={fontSize} size="medium" onChange={handleFontSizeChange}  color="secondary" />
      </div>
      <p className='text-white ml-5'>{fontSize}</p>
    </>
  )
}
export default ChangeFontSizeSlider
