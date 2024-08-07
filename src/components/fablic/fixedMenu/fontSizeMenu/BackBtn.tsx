import { BackBtnProps } from '@/type/fabricType';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackBtn = ({ setIsFontSize }: BackBtnProps) => {
  return (
    <div className='mr-5 flex items-center'>
      <button type='button' onClick={() => { setIsFontSize(false) }} className='hover:opacity-75'>
        <div className='flex justify-center'>
          <ArrowBackIcon color='inherit'/>
        </div>
        <div>
          <p className='text-white'>
            戻る
          </p>
        </div>
      </button>
    </div>
  )
}

export default BackBtn
