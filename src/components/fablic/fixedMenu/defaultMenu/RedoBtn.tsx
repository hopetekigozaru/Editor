import { RedoBtnProps } from '@/type/fabricType';
import RedoIcon from '@mui/icons-material/Redo';

const RedoBtn = ({ canvas, redoStack, setRedoStack, setUndoStack, isMobile ,addToStack ,restoreGridProperties }: RedoBtnProps) => {
  const handleRedo = () => {
    if (canvas && redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];

      setUndoStack(prevStack => addToStack(prevStack, JSON.stringify(canvas.toJSON(['isGrid']))));
      setRedoStack(prevStack => prevStack.slice(0, -1));

      canvas.loadFromJSON(JSON.parse(nextState), () => {
        restoreGridProperties(canvas);
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
