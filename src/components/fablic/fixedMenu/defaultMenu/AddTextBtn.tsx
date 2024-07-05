import TitleIcon from '@mui/icons-material/Title';
import { fabric } from 'fabric';

interface AddTextProps {
  canvas: fabric.Canvas | null;
  saveState: () => void;
}

const AddTextBtn = ({canvas,saveState}:AddTextProps) => {
  const addText = (
    text: string,
    x: number,
    y: number,
    fontSize: number,
    rotation: number,
    canvas: fabric.Canvas | null
  ) => {
    if (canvas) {
      const textObject = new fabric.Textbox(text, {
        left: x,
        top: y,
        fontSize: fontSize,
        angle: rotation,
        fill: '#000000',
        fontFamily: 'Arial',
      });
      canvas.add(textObject);
      saveState();
    }
  };
  return (
    <div>
      <button type='button' onClick={() => addText('New Text', 50, 50, 24, 0, canvas)}>
        <div>
          <TitleIcon />
        </div>
        <div>
          <p className='text-xs'>
            テキストを追加
          </p>
        </div>
      </button>
    </div>
  )
}

export default AddTextBtn;