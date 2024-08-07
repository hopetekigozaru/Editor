import { ChangeFontSizeBtnProps } from '@/type/fabricType';
import FormatSizeIcon from '@mui/icons-material/FormatSize';

const ChangeFontSizeBtn = ({ setIsFontSize }: ChangeFontSizeBtnProps) => {
  return (
    <button type='button' onClick={() => { setIsFontSize((prev) => !prev) }} className='hover:opacity-75' >
      <div>
        <FormatSizeIcon />
      </div>
      <div>
        <p className='text-white'>
          テキストサイズ
        </p>
      </div>
    </button>
  )
}

export default ChangeFontSizeBtn
