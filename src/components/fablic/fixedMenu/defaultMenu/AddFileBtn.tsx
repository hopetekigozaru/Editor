import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ChangeEventHandler, MouseEvent } from 'react';
import { fabric } from 'fabric';
import { useTheme } from '@mui/material';

interface AddFileProps {
  canvas: fabric.Canvas | null;
  saveState: () => void;
  clickInput: (e: MouseEvent<HTMLButtonElement>) => void
}
const AddFileBtn = ({ canvas, saveState, clickInput }: AddFileProps) => {
  const theme = useTheme().palette;
  const handleImageUpload: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0]; // ファイルオブジェクトを取得
    if (file) {
      addImage(file, canvas);
    }
  };

  const addImage = (file: File, canvas: fabric.Canvas | null) => {
    if (canvas) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const fabricImg = new fabric.Image(img, {
            left: 50,
            top: 50,
            angle: 0,
            transparentCorners: false,
            borderColor: theme.secondary.main,  // 枠線の色
            cornerColor: theme.secondary.main,  // コーナーの色
            cornerStyle: 'circle',
            cornerSize: 9,
            selectable: false
          });
          canvas.add(fabricImg);
          canvas.setActiveObject(fabricImg)
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
      saveState();
    }
  };
  return (
    <div className='flex justify-center'>
      <input type='file' className='absolute opacity-0 w-0' onChange={handleImageUpload} />
      <button type='button' className='cursor-pointer hover:opacity-75' onClick={clickInput}>
        <div className='flex justify-center'>
          <AttachFileIcon />
        </div>
        <div>
          <p className='text-sm'>
            ファイルを選択
          </p>
        </div>
      </button>
    </div>
  )
}

export default AddFileBtn
