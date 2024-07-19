import FormatSizeIcon from '@mui/icons-material/FormatSize';
interface ChangeFontSizeBtnProps {
  setIsFontSize: React.Dispatch<React.SetStateAction<boolean>>
}
const ChangeFontSizeBtn = ({ setIsFontSize }: ChangeFontSizeBtnProps) => {
  return (
    <button type='button' onClick={() => { setIsFontSize((prev) => !prev) }} className='hover:opacity-75' >
      <div>
        <FormatSizeIcon color='primary' />
      </div>
      <div>
        <p className='text-primary'>
          テキストサイズ
        </p>
      </div>
    </button>
  )
}

export default ChangeFontSizeBtn
