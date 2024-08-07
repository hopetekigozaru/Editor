import DeleteBtn from './DeleteBtn';
import { BubbleMenuProps } from '@/type/fabricType';

const BubbleMenu = ({ canvas, saveState, bubbleRef, selectObject, bubbleMenuPosition }: BubbleMenuProps) => {
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
        <DeleteBtn canvas={canvas} saveState={saveState} />
      </div>
    </div>
  )
}

export default BubbleMenu