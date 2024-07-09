import DeleteIcon from '@mui/icons-material/Delete';
import { Object } from 'fabric/fabric-impl';

interface DeleteBtnProps {
  canvas: fabric.Canvas | null;
  activeObj: Object | null;
  saveState: () => void;
}

const DeleteBtn = ({ canvas, activeObj, saveState }: DeleteBtnProps) => {

  const deleteSelectedObject = () => {
    if (canvas && activeObj) {
      if (activeObj.type === 'group') {
        canvas.remove(activeObj); // グループ自体も削除する
        deleteGroupObjects(activeObj as fabric.Group);
      } else {
        canvas.remove(activeObj); // グループではない単一のオブジェクトを削除する
      }

      canvas.discardActiveObject(); // アクティブオブジェクトを削除
      canvas.requestRenderAll(); // キャンバスを再レンダリング
      saveState(); // 状態を保存する
    }
  };

  const deleteGroupObjects = (group: fabric.Group) => {
    if (canvas) {
      if (group._objects) {
        group._objects.forEach(obj => {
          canvas.remove(obj); // グループ内の各オブジェクトを削除する
          deleteGroupObjects(obj as fabric.Group); // グループ内のグループも再帰的に削除する
        });
      }
      canvas.remove(group); // グループ自体も削除する
    }
  };

  return (
    <button type='button' onClick={deleteSelectedObject} className='hover:opacity-75' ><DeleteIcon className='text-black' color='error' /></button>
  )
}

export default DeleteBtn