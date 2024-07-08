'use client'

import { Box, Button, Modal } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useState } from "react";

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

const RegisterButton = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const registerLink = (width: number, height: number) => {
    setOpen(false);
    router.push('/register?width=' + width + '&height=' + height)
  }

  return (
    <Fragment>
      <button onClick={handleOpen} className="mr-10">新規作成</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: '50vw' }}>
          <div className="w-full grid grid-cols-2 gap-y-10">
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
    </Fragment>
  )
}

export default RegisterButton