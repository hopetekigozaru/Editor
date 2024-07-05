import { fabric } from 'fabric';
import { Object } from 'fabric/fabric-impl';
import { isEmpty } from 'lodash';
import DeleteBtn from './DeleteBtn';
import GroupBtn from './GroupBtn';

interface BubbleMenuProps {
  canvas: fabric.Canvas | null;
  activeObj: Object | null;
  saveState: () => void;
  bubbleRef: React.RefObject<HTMLDivElement>;
  selectObject: boolean
  bubbleMenuPosition: {
    left: number | undefined;
    top: number | undefined;
  }

}
const BubbleMenu = ({ canvas, activeObj, saveState, bubbleRef, selectObject, bubbleMenuPosition }: BubbleMenuProps) => {
  return (
    <div
      ref={bubbleRef}
      className={`absolute bg-gray-200 opacity-80 rounded p-2 z-10 ${selectObject ? 'block' : 'hidden'}`}
      style={{
        left: bubbleMenuPosition.left,
        top: bubbleMenuPosition.top,
        pointerEvents: 'auto', // これでバブルメニューが他の要素のイベントをブロックしないようにする
      }}
    >
      <div className='flex'>
        {/* バブルメニューのコンテンツをここに追加 */}
        <DeleteBtn canvas={canvas} activeObj={activeObj} saveState={saveState} />
        {(activeObj && !isEmpty((activeObj as fabric.Group)._objects) && (activeObj as fabric.Group).type != 'group' && (activeObj as fabric.Group)._objects.length != 0) &&
          <GroupBtn canvas={canvas} saveState={saveState} />
        }
      </div>
    </div>
  )
}

export default BubbleMenu