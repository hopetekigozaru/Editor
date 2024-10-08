import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Modal } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';

const style = {
  position: 'absolute' as 'absolute',
  top: '50vh',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '20px',
  pt: 2,
  px: 4,
  pb: 3,
};

const DeleteBtn = ({ uuid,isMobile , setLoading }: { uuid: string,isMobile:boolean, setLoading:Dispatch<SetStateAction<string | null>> },) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteKeep = async () => {
    handleClose()
    setLoading('Deleting')
    const body = JSON.stringify({
      uuid: uuid,
    });

    const res = await fetch('/api/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (res && res.status == 200) {
      router.push('/dashboard/1')
    } else {
      setLoading(null)
    }
  }

  return (
    <>
    <div className='flex justify-center'>
      <button type='button' onClick={handleOpen} className='text-red-500 hover:opacity-75'>
        <DeleteIcon />
        <div className='text-sm'>
          削除
        </div>
      </button>
    </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: isMobile? '90vw':'50vw' }}>
          <div className='w-full flex justify-center'>
            <div className="w-[80%] flex flex-col justify-center items-center my-10">
              <div className='text-black text-lg w-full text-center'>
                削除しますか？
              </div>
              <div className="flex w-full justify-between mt-5">
                <Button variant="contained" color="error" onClick={deleteKeep}>削除する</Button>
                <Button variant="contained" color='secondary' onClick={() => setOpen(false)}>キャンセル</Button>
              </div>
            </div>

          </div>
        </Box>
      </Modal>
    </>
  )
}

export default DeleteBtn
