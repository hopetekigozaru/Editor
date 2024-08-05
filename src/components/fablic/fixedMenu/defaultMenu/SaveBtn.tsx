import useSave from '@/hooks/fabric/useSave';
import { SaveBtnProps } from '@/type/fabricType';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { Box, Button, Modal, TextField } from '@mui/material';
import { useRouter} from 'next/navigation';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '20px',
  pt: 2,
  px: 4,
  pb: 3,
};

const SaveBtn = ({ canvas, setGridLines, gridLines, keep, isMobile }: SaveBtnProps) => {
  const router = useRouter();
  const {
    handleOpen,
    open,
    handleClose,
    saveCanvas,
    title,
    setTitle
  } = useSave(canvas,keep,gridLines,setGridLines,router)


  return (
    <div className='flex justify-center'>
      <button type='button' className='cursor-pointer hover:opacity-75' onClick={handleOpen} >
        <div className='flex justify-center'>
          <SaveAltIcon />
        </div>
        <div>
          <p className='text-sm'>
            一時保存
          </p>
        </div>
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        style={{ height: '100vh' }}
      >
        <Box sx={{ ...style, width: isMobile?'90vw':'50vw' }}>
          <div className="w-full flex flex-col justify-center my-10">
            <form onSubmit={saveCanvas}>
              <div className='flex justify-center'>
                <TextField variant='outlined' color='secondary' value={title} onChange={(e) => setTitle(e.target.value)} label="タイトル" required />
              </div>
              <div className="flex justify-center mt-5">
                <Button type='submit' variant="contained" color='secondary'>保存する</Button>
              </div>

            </form>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default SaveBtn
