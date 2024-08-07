import { PanningBtnProps } from '@/type/fabricType';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

const PanningBtn = ({ canvas, constrainViewport, isPan, setIsPan, setIsZoom,isMobile  }: PanningBtnProps) => {
  const panning = () => {
    if (canvas) {
      const zoom = canvas.getZoom();
      let newZoom = zoom;
      if (newZoom <= 1.1) {
        newZoom = 1
        setIsPan(false)
      } else {
        newZoom = zoom - 0.1;
        setIsZoom(true)
      }
      canvas.zoomToPoint({ x: canvas.width! / 2, y: canvas.height! / 2 }, newZoom);
      constrainViewport();
    }
  }
  return (
    <button className={`block p-2 ${isMobile  ? 'ml-2':'ml-0 mt-1'} ${isPan ? 'bg-primary hover:opacity-80' : 'bg-gray-500'}`} onClick={panning} >
      <ZoomOutIcon fontSize={isMobile  ? 'medium' : 'large'} className="text-white" />
    </button>
  )
}

export default PanningBtn
