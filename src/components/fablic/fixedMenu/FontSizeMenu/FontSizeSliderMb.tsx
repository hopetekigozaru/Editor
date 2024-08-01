import { ChangeFontSizeSliderMbProps } from "@/type/fabricType";
import { Slider } from "@mui/material"
import { debounce } from "lodash";
import { useEffect, useState } from "react";

const ChangeFontSizeSliderMb = ({ canvas, saveState }: ChangeFontSizeSliderMbProps) => {
  const [fontSize, setFontSize] = useState<number>(0);

  useEffect(() => {
    const activeObj = canvas?.getActiveObject();
    const type = activeObj?.type
    if(type === 'textbox'){
      const text = activeObj as fabric.Textbox
      const size = text.fontSize as number
      setFontSize(size);
    }
  }, []);

  const debouncedFontSizeChange = debounce((fontSize: number) => {
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if ( activeObj !== null && activeObj.type === 'textbox') {
      const text = activeObj as fabric.Textbox
      setFontSize(fontSize);
      text.set({ fontSize });
      text.set('width', text.minWidth); // 幅をリセット
      text.setCoords(); // 座標を更新

      // オブジェクトのバウンディングボックスを取得
      const boundingBox = activeObj.getBoundingRect();

      // オブジェクトがキャンバス外に出ないように調整
      if (boundingBox.left < 0) {
        activeObj.set('left', 0);
      }
      if (boundingBox.top < 0) {
        activeObj.set('top', 0);
      }
      if (boundingBox.left + boundingBox.width > canvas.getWidth()) {
        activeObj.set('left', canvas.getWidth() - boundingBox.width);
      }
      if (boundingBox.top + boundingBox.height > canvas.getHeight()) {
        activeObj.set('top', canvas.getHeight() - boundingBox.height);
      }

      activeObj.setCoords(); // 座標を再度更新
      canvas.renderAll();
      saveState();
    }
  }, 50); // 50ミリ秒のデバウンス時間

  const handleFontSizeChange = (event: Event, value: number | number[], activeThumb: number) => {
    const newSize = value as number;
    debouncedFontSizeChange(newSize); // デバウンスされた関数を呼び出す
  };
  return (
    <>
      <div className="text-primary">
        フォントサイズ
      </div>
      <div className="flex items-center">
        <div className='w-full flex items-center'>
          <Slider value={fontSize} size="medium" onChange={handleFontSizeChange} color="secondary" />
        </div>
        <p className='text-primary ml-5'>{fontSize}</p>
      </div>
    </>
  )
}
export default ChangeFontSizeSliderMb
