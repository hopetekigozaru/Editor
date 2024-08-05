import { RedoBtnProps } from '@/type/fabricType';
import RedoIcon from '@mui/icons-material/Redo';
import { useTheme } from '@mui/material';

const RedoBtn = ({ canvas, redoStack, setRedoStack, setUndoStack, isMobile ,addToStack ,restoreGridProperties }: RedoBtnProps) => {
  const theme = useTheme().palette;
  const handleRedo = () => {
    if (canvas && redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];

      setUndoStack(prevStack => addToStack(prevStack, JSON.stringify(canvas.toJSON(['isGrid']))));
      setRedoStack(prevStack => prevStack.slice(0, -1));

      canvas.loadFromJSON(JSON.parse(nextState), () => {
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
      <button type='button' onClick={handleRedo} className={`cursor-pointer hover:opacity-75`}>
        <div className='flex justify-center'>
          <RedoIcon />
        </div>
        <div>
          {!isMobile  &&
            <p className={`text-sm`}>
              進む
            </p>
          }
        </div>
      </button>
    </div>
  )
}

export default RedoBtn;
