import { UndoBtnProps } from '@/type/fabricType';
import UndoIcon from '@mui/icons-material/Undo';
import { useTheme } from '@mui/material';

const UndoBtn = ({ canvas, undoStack, setUndoStack, setRedoStack, isMobile, addToStack, restoreGridProperties }: UndoBtnProps) => {
  const theme = useTheme().palette;
  const handleUndo = () => {
    if (canvas && undoStack.length > 1) {
      const currentState = undoStack[undoStack.length - 1];
      const previousState = undoStack[undoStack.length - 2];

      setRedoStack(prevStack => addToStack(prevStack, currentState));
      setUndoStack(prevStack => prevStack.slice(0, -1));

      canvas.loadFromJSON(JSON.parse(previousState), () => {
        restoreGridProperties(canvas);

        canvas.forEachObject(obj => {
          if (obj.type === 'textbox' || obj.type === 'image' || obj.type === 'rect' || obj.type === 'circle') {
            obj.set({
              borderColor: theme.secondary.main,  // 枠線の色
              cornerColor: theme.secondary.main,  // コーナーの色
              cornerStyle: 'circle',
              cornerSize: 9,
              transparentCorners: false,
              selectable: true
            });
          }
        });

        canvas.renderAll();
      });
    }
  };

  return (
    <div className='flex justify-center'>
      <button type='button' onClick={handleUndo} className='cursor-pointer hover:opacity-75'>
        <div className='flex justify-center'>
          <UndoIcon />
        </div>
        <div>
          {!isMobile &&
            <p className={`text-sm`}>
              戻る
            </p>
          }
        </div>
      </button>
    </div>
  )
}

export default UndoBtn
