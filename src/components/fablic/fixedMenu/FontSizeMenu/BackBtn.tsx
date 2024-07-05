import ArrowBackIcon from '@mui/icons-material/ArrowBack';
interface BackBtnProps {
  setIsFontSize: React.Dispatch<React.SetStateAction<boolean>>
}
const BackBtn = ({setIsFontSize}:BackBtnProps) => {
  return (
    <div className='mr-5'>
      <button type='button' onClick={() => { setIsFontSize(false) }}>
        <div className='flex justify-center'>
          <ArrowBackIcon />
        </div>
        <div>
          <p className='text-xs'>
            戻る
          </p>
        </div>
      </button>
    </div>
  )
}

export default BackBtn