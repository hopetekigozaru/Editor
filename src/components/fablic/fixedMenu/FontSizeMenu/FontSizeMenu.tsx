import BackBtn from './BackBtn';
import ChangeFontSizeSlider from './ChangeFontSizeSlider';

interface FontSizeMenuProps {
  canvas: fabric.Canvas | null;
  activeObj: fabric.Textbox | undefined;
  saveState: () => void;
  setIsFontSize: React.Dispatch<React.SetStateAction<boolean>>
}

const FontSizeMenu = ({canvas,activeObj,saveState,setIsFontSize}:FontSizeMenuProps) => {
  return (
    <div className='w-full flex justify-center'>
      <div className='flex justify-center w-full'>
        <BackBtn setIsFontSize={setIsFontSize} />
        <ChangeFontSizeSlider canvas={canvas} activeObj={activeObj} saveState={saveState} />
      </div>
    </div>
  )
}

export default FontSizeMenu