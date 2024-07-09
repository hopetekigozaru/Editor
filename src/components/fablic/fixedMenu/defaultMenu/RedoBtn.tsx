import RedoIcon from '@mui/icons-material/Redo';


interface RedoBtnProps {
  canvas: fabric.Canvas | null;
  redoStack: string[];
  setUndoStack: React.Dispatch<React.SetStateAction<string[]>>;
  setRedoStack: React.Dispatch<React.SetStateAction<string[]>>;
  maxHistory: number;
}

const RedoBtn = ({ canvas, redoStack, setRedoStack, setUndoStack, maxHistory }: RedoBtnProps) => {
  const handleRedo = () => {
    if (redoStack.length > 0 && canvas) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack(prevUndoStack => {
        const newUndoStack = [...prevUndoStack, JSON.stringify(canvas.toJSON(['isGrid']))];
        if (newUndoStack.length > maxHistory) {
          newUndoStack.shift();
        }
        return newUndoStack;
      });
      setRedoStack(prevRedoStack => prevRedoStack.slice(0, -1));
      canvas.loadFromJSON(JSON.parse(nextState), () => {
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
      <button type='button' onClick={handleRedo} className='cursor-pointer hover:opacity-75'>
        <div className='flex justify-center'>
          <RedoIcon fontSize='large' />
        </div>
        <div>
          <p>
            進む
          </p>
        </div>
      </button>
    </div>
  )
}

export default RedoBtn;
