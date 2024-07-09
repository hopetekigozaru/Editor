import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { Dispatch, SetStateAction } from 'react';

interface ZoomBtnProps {
  canvas: fabric.Canvas | null
  constrainViewport: () => void
  isZoom: boolean
  setIsZoom: Dispatch<SetStateAction<boolean>>
  setIsPan: Dispatch<SetStateAction<boolean>>
}

const ZoomBtn = ({ canvas, constrainViewport, isZoom, setIsZoom, setIsPan }: ZoomBtnProps) => {
  const zoom = () => {
    if (canvas) {
      const zoom = canvas.getZoom();
      let newZoom = zoom;
      if (zoom >= 2.9) {
        newZoom = 3
        setIsZoom(false)
      } else {
        newZoom = zoom + 0.1
        setIsPan(true)
      }
      canvas.zoomToPoint({ x: canvas.width! / 2, y: canvas.height! / 2 }, newZoom);
      constrainViewport();
    }
  }
  return (
    <button className={`block p-2 ${isZoom ? 'bg-primary hover:opacity-80' : 'bg-gray-500'}`} onClick={zoom}>
      <ZoomInIcon fontSize='large' className="text-white" />
    </button>
  )
}
export default ZoomBtn
