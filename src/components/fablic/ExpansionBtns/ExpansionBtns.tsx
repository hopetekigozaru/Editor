import { useEffect, useState } from "react"
import PanningBtn from "./PanningBtn"
import ZoomBtn from "./ZoomBtns"
interface ExpansionBtnsProps {
  canvas: fabric.Canvas | null
  constrainViewport: () => void
}
const ExpansionBtns = ({ canvas, constrainViewport }: ExpansionBtnsProps) => {
  const [isZoom, setIsZoom] = useState(true);
  const [isPan, setIsPan] = useState(false);

  useEffect(() => {
    if (canvas) {
      const handleMouseWheel = (opt: any) => {
        const delta = opt.e.deltaY;
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;

        if (zoom >= 3) {
          zoom = 3;
          setIsZoom(false)
        } else if (zoom <= 1) {
          zoom = 1;
          setIsPan(false)
        } else {
          setIsZoom(true)
          setIsPan(true)
        }
        canvas.setZoom(zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
        constrainViewport()
      };

      canvas.on('mouse:wheel', handleMouseWheel);

      return () => {
        canvas.off('mouse:wheel', handleMouseWheel);
      }
    }
  }, [canvas])
  return (
    <div className='h-full flex items-end  pl-3'>
      <div>
        <ZoomBtn canvas={canvas} isZoom={isZoom} setIsZoom={setIsZoom} setIsPan={setIsPan} constrainViewport={constrainViewport} />
        <PanningBtn canvas={canvas} isPan={isPan} setIsPan={setIsPan} setIsZoom={setIsZoom} constrainViewport={constrainViewport} />
      </div>
    </div>
  )
}

export default ExpansionBtns