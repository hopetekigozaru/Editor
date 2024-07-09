import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackBtnProps {
  canvas: fabric.Canvas | null;
}

const BackBtn = ({ canvas }: BackBtnProps) => {

  const focusOut = () => {
    if (canvas) {
      canvas.discardActiveObject()
      canvas.renderAll()
    }
  }

  return (
    <button type='button' onClick={focusOut} className='hover:opacity-75'>
      <div className='flex justify-center'>
        <ArrowBackIcon fontSize='large' />
      </div>
      <div>
        <p>
          戻る
        </p>
      </div>
    </button>
  )
}

export default BackBtn
