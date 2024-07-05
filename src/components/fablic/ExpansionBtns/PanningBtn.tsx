import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { Dispatch, SetStateAction } from 'react';

interface PanningBtnProps {
  canvas: fabric.Canvas | null
  constrainViewport: () => void;
  isPan: boolean
  setIsPan: Dispatch<SetStateAction<boolean>>
  setIsZoom: Dispatch<SetStateAction<boolean>>
}

const PanningBtn = ({ canvas ,constrainViewport , isPan,setIsPan,setIsZoom}: PanningBtnProps) => {
  const panning = () => {
    if (canvas) {
      const zoom = canvas.getZoom();
      let newZoom = zoom;
      if(newZoom <= 1.1){
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
  console.log(isPan)
  return (
    <button className={`block  mt-1 ${isPan ? 'bg-gray-800' : 'bg-gray-500'}`} onClick={panning} >
      <ZoomOutIcon className="text-white" />
    </button>
  )
}

export default PanningBtn