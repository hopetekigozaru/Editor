import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ChangeEventHandler, MouseEvent } from 'react';
import { fabric } from 'fabric';

interface AddFileProps {
  canvas: fabric.Canvas | null;
  saveState: () => void;
  clickInput:(e: MouseEvent<HTMLButtonElement>) => void
}
const AddFileBtn = ({canvas,saveState,clickInput}:AddFileProps) => {

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
          });
          canvas.add(fabricImg);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
      saveState();
    }
  };
  return (
    <div>
      <div>
        <input type='file' className='absolute opacity-0 w-0' onChange={handleImageUpload} />
        <button type='button' className='cursor-pointer' onClick={clickInput}>
          <div className='flex justify-center'>
            <AttachFileIcon />
          </div>
          <div>
            <p className='text-xs'>
              ファイルを選択
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default AddFileBtn