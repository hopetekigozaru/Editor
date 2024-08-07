import { Box, Button, Modal } from "@mui/material"
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

const style = {
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '20px',
  pt: 2,
  px: 4,
  pb: 3,
};

interface RegisterModalProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}


const RegisterModal = ({open,setOpen}:RegisterModalProps) => {
  const router = useRouter();

  const registerLink = (width: number, height: number) => {
    setOpen(false);
    router.push('/register?width=' + width + '&height=' + height)
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box className="w-[90%] md:w-[50vw] absolute left-[50%] top-[50%]" sx={{ ...style}}>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-5 md:gap-y-10">
          <div className="flex justify-center">
            <Button variant="outlined" onClick={() => registerLink(800, 400)}>名刺サイズ(800 × 400)</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="outlined" onClick={() => registerLink(400, 400)}>〇〇サイズ(400 × 400)</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="outlined" onClick={() => registerLink(300, 400)}>〇〇サイズ(300 × 400)</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="outlined" onClick={() => registerLink(600, 400)} >〇〇サイズ(600 × 400)</Button>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

export default RegisterModal