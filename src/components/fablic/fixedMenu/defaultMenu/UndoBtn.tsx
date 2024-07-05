import UndoIcon from '@mui/icons-material/Undo';
interface UndoBtnProps {
  canvas: fabric.Canvas | null;
  undoStack: string[];
  setUndoStack: React.Dispatch<React.SetStateAction<string[]>>;
  continuous: boolean;
  setContinuous: React.Dispatch<React.SetStateAction<boolean>>;
  setRedoStack: React.Dispatch<React.SetStateAction<string[]>>;
  maxHistory: number;
}
const UndoBtn = ({ canvas, undoStack, setUndoStack, continuous, setContinuous, setRedoStack, maxHistory }: UndoBtnProps) => {
  const handleUndo = () => {
    if (undoStack.length > 0 && canvas) {
      let previousState = undoStack[undoStack.length - 1];
      if (!continuous) {
        previousState = undoStack[undoStack.length - 2];
        setContinuous(true)
      }
      setRedoStack(prevRedoStack => {
        const newRedoStack = [...prevRedoStack, JSON.stringify(canvas.toJSON(['isGrid']))];
        if (newRedoStack.length > maxHistory) {
          newRedoStack.shift();
        }
        return newRedoStack;
      });
      setUndoStack(prevUndoStack => prevUndoStack.slice(0, -1));
      canvas.loadFromJSON(JSON.parse(previousState), () => {
        canvas.renderAll.bind(canvas);
        // Restore grid lines to be unselectable
        canvas.getObjects().forEach((obj) => {
          if ((obj as any).isGrid) {
            obj.set({ selectable: false, evented: false });
          }
        });
      });
    }
  };
  return (
    <div>
      <button type='button' onClick={handleUndo} className='cursor-pointer'>
        <div className='flex justify-center'>
          <UndoIcon />
        </div>
        <div>
          <p className='text-xs'>
            戻る
          </p>
        </div>
      </button>
    </div>
  )
}

export default UndoBtn