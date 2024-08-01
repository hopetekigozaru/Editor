import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ChangeEventHandler } from 'react';
import { fabric } from 'fabric';
import { useTheme } from '@mui/material';
import { AddFileProps } from '@/type/fabricType';

const AddFileBtn = ({ canvas, saveState, clickInput }: AddFileProps) => {
  const theme = useTheme().palette;
  const handleImageUpload: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0]; // ファイルオブジェクトを取得
    if (file) {
      addImage(file, canvas,theme,saveState);
    }
  };

  const addImage = (file: File, canvas: fabric.Canvas | null, theme: any, saveState: () => void) => {
    if (canvas) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          const maxImgWidth = canvasWidth * 0.5; // Canvas幅の50%に設定
          const maxImgHeight = canvasHeight * 0.5; // Canvas高さの50%に設定

          // 画像のアスペクト比を保ちながら、幅と高さを調整
          let imgWidth = img.width;
          let imgHeight = img.height;
          const aspectRatio = imgWidth / imgHeight;

          if (imgWidth > maxImgWidth || imgHeight > maxImgHeight) {
            if (imgWidth > maxImgWidth) {
              imgWidth = maxImgWidth;
              imgHeight = imgWidth / aspectRatio;
            }
            if (imgHeight > maxImgHeight) {
              imgHeight = maxImgHeight;
              imgWidth = imgHeight * aspectRatio;
            }
          }

          // 画像がCanvasの中央に収まるように位置を調整
          const left = (canvasWidth - imgWidth) / 2;
          const top = (canvasHeight - imgHeight) / 2;

          const fabricImg = new fabric.Image(img, {
            left: left,
            top: top,
            scaleX: imgWidth / img.width,
            scaleY: imgHeight / img.height,
            angle: 0,
            transparentCorners: false,
            borderColor: theme.secondary.main, // 枠線の色
            cornerColor: theme.secondary.main, // コーナーの色
            cornerStyle: 'circle',
            cornerSize: 9,
            selectable: true
          });

          canvas.add(fabricImg);
          canvas.setActiveObject(fabricImg);
          canvas.renderAll();
          saveState();
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
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
            ファイル＋
          </p>
        </div>
      </button>
    </div>
  )
}

export default AddFileBtn
