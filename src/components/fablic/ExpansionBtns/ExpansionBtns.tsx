import { useState } from "react"
import PanningBtn from "./PanningBtn"
import ZoomBtn from "./ZoomBtns"
interface ExpansionBtnsProps{
  canvas: fabric.Canvas | null
  constrainViewport: () => void
}
const ExpansionBtns = ({canvas,constrainViewport}:ExpansionBtnsProps) => {
  const [isZoom,setIsZoom] = useState(true);
  const [isPan,setIsPan] = useState(false);
  return (
    <div className='h-full flex items-end text-black pl-3'>
      <div>
        <ZoomBtn canvas={canvas} isZoom={isZoom} setIsZoom={setIsZoom} setIsPan={setIsPan} constrainViewport={constrainViewport}/>
        <PanningBtn canvas={canvas} isPan={isPan} setIsPan={setIsPan} setIsZoom={setIsZoom} constrainViewport={constrainViewport}/>
      </div>
    </div>
  )
}

export default ExpansionBtns