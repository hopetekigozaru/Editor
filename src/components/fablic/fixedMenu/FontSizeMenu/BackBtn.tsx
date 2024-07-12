import ArrowBackIcon from '@mui/icons-material/ArrowBack';
interface BackBtnProps {
  setIsFontSize: React.Dispatch<React.SetStateAction<boolean>>
}
const BackBtn = ({ setIsFontSize }: BackBtnProps) => {
  return (
    <div className='mr-5 flex items-center'>
      <button type='button' onClick={() => { setIsFontSize(false) }} className='hover:opacity-75'>
        <div className='flex justify-center'>
          <ArrowBackIcon color='primary'/>
        </div>
        <div>
          <p className='text-primary'>
            戻る
          </p>
        </div>
      </button>
    </div>
  )
}

export default BackBtn
