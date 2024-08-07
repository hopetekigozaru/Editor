'use client'
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import RegisterModal from './RegisterModal';
const RegisterButtonSp = () => {
  const [open,setOpen] = useState(false)
  return(
  <>
  <button onClick={() => {setOpen(true)}} className="flex md:hidden justify-center items-center fixed bottom-[5%] right-[3%] bg-primary text-white font-bold w-[18vw] aspect-square rounded-full">
    <AddIcon fontSize='large'/>
  </button>
  <RegisterModal open={open} setOpen={setOpen}/>
  </>
)
}

export default RegisterButtonSp