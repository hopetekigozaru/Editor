import FormatSizeIcon from '@mui/icons-material/FormatSize';
interface ChangeFontSizeBtnProps {
  setIsFontSize: React.Dispatch<React.SetStateAction<boolean>>
}
const ChangeFontSizeBtn = ({setIsFontSize}:ChangeFontSizeBtnProps) => {
  return (
    <button type='button' onClick={() => { setIsFontSize((prev) => !prev) }} >
      <div>
        <FormatSizeIcon />
      </div>
      <div>
        <p className='text-xs'>
          テキストサイズ
        </p>
      </div>
    </button>
  )
}

export default ChangeFontSizeBtn