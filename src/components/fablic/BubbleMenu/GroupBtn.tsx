import { Button } from "@mui/material"
import { fabric } from 'fabric';
interface GroupBtnProps {
  canvas: fabric.Canvas | null;
  saveState: () => void;
}

const GroupBtn = ({canvas,saveState }: GroupBtnProps) => {
  const groupSelectedObjects = () => {
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 1) {
      // Temporarily deselect all objects
      canvas.discardActiveObject();
      canvas.requestRenderAll();

      let smallestLeft = activeObjects[0].left; // Initial left position
      let smallestTop = activeObjects[0].top; // Initial top position

      activeObjects.forEach(obj => {
        if ('left' in obj) {
          const objLeft = obj.left;
          if (objLeft != undefined && smallestLeft != undefined && objLeft < smallestLeft) {
            smallestLeft = objLeft; // Update to the smallest left position
          }
        }
        if ('top' in obj) {
          const objTop = obj.top;
          if (objTop != undefined && smallestTop != undefined && objTop < smallestTop) {
            smallestTop = objTop; // Update to the smallest top position
          }
        }
      });

      const group = new fabric.Group(activeObjects, {
        left: smallestLeft,
        top: smallestTop,
        angle: 0
      });

      // Add the group to the canvas
      canvas.add(group);
      canvas.setActiveObject(group);

      // Remove the original objects from the canvas
      activeObjects.forEach(obj => {
        canvas.remove(obj);
      });

      canvas.requestRenderAll();
      saveState();
    }
  };

  return (
    <div>
      <Button onClick={groupSelectedObjects}>グループ化</Button>
    </div>
  )
}

export default GroupBtn