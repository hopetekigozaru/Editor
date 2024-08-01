import { FontSizeMenuProps } from '@/type/fabricType';
import BackBtn from './BackBtn';
import ChangeFontSizeSlider from './ChangeFontSizeSlider';

const FontSizeMenu = ({canvas,saveState,setIsFontSize}:FontSizeMenuProps) => {
  return (
    <div className='w-full flex justify-center'>
      <div className='flex justify-center w-full'>
        <BackBtn setIsFontSize={setIsFontSize} />
        <ChangeFontSizeSlider canvas={canvas} saveState={saveState} />
      </div>
    </div>
  )
}

export default FontSizeMenu