'use client'

import { Fragment, useState } from "react";
import RegisterModal from "./RegisterModal";



const RegisterButton = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Fragment>
      <button onClick={handleOpen} className="mr-10 text-xl hover:opacity-75 hidden md:block">新規作成</button>
      <RegisterModal open={open} setOpen={setOpen}/>
    </Fragment>
  )
}

export default RegisterButton
