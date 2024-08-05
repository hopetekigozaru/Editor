
import { AddTextProps } from '@/type/fabricType';
import TitleIcon from '@mui/icons-material/Title';
import { useTheme } from '@mui/material';
import { fabric } from 'fabric';



const AddTextBtn = ({ canvas, saveState }: AddTextProps) => {
  const theme = useTheme().palette;
  const addText = (
    text: string,
    x: number,
    y: number,
    fontSize: number,
    rotation: number,
    canvas: fabric.Canvas | null
  ) => {
    if (canvas) {

      const customControls = {
        tl: fabric.Object.prototype.controls.tl, // 左上
        tr: fabric.Object.prototype.controls.tr, // 右上
        br: fabric.Object.prototype.controls.br, // 右下
        bl: fabric.Object.prototype.controls.bl, // 左下
        mtr: fabric.Object.prototype.controls.mtr // ローテーション
      };

      const textObject = new fabric.Textbox(text, {
        left: x,
        top: y,
        fontSize: fontSize,
        angle: rotation,
        fill: '#000000',
        fontFamily: 'Arial',
        textAlign: 'center',
        borderColor: theme.secondary.main,  // 枠線の色
        cornerColor: theme.secondary.main,  // コーナーの色
        cornerStyle: 'circle',
        cornerSize: 9,
        editable: true,
      });

      // カスタムコントロールを設定
      textObject.controls = customControls;

      canvas.add(textObject);
      canvas.setActiveObject(textObject)
      saveState();
    }
  };
  return (
    <div className='flex justify-center'>
      <button className='hover:opacity-75' type='button' onClick={() => addText('新しいテキスト', 50, 50, 24, 0, canvas)}>
        <div>
          <TitleIcon />
        </div>
        <div>
          <p className='text-sm'>
            テキスト＋
          </p>
        </div>
      </button>
    </div>
  )
}

export default AddTextBtn;
