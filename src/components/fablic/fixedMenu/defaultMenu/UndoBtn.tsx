import UndoIcon from '@mui/icons-material/Undo';
interface UndoBtnProps {
  canvas: fabric.Canvas | null;
  undoStack: string[];
  setUndoStack: React.Dispatch<React.SetStateAction<string[]>>;
  continuous: boolean;
  setContinuous: React.Dispatch<React.SetStateAction<boolean>>;
  setRedoStack: React.Dispatch<React.SetStateAction<string[]>>;
  isMobaile: boolean
  addToStack: (stack: string[], item: string) => string[]
  restoreGridProperties: (canvas: fabric.Canvas) => void
}
const UndoBtn = ({ canvas, undoStack, setUndoStack, setRedoStack, isMobaile, addToStack, restoreGridProperties }: UndoBtnProps) => {
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
          {!isMobaile &&
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
