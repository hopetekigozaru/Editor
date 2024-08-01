import { UndoBtnProps } from '@/type/fabricType';
import UndoIcon from '@mui/icons-material/Undo';

const UndoBtn = ({ canvas, undoStack, setUndoStack, setRedoStack, isMobile , addToStack, restoreGridProperties }: UndoBtnProps) => {
  const handleUndo = () => {
    if (canvas && undoStack.length > 1) {
      const currentState = undoStack[undoStack.length - 1];
      const previousState = undoStack[undoStack.length - 2];

      setRedoStack(prevStack => addToStack(prevStack, currentState));
      setUndoStack(prevStack => prevStack.slice(0, -1));

      canvas.loadFromJSON(JSON.parse(previousState), () => {
        restoreGridProperties(canvas);
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
          {!isMobile  &&
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
