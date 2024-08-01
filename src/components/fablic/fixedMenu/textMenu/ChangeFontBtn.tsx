import { ChangeFontBtnProps } from '@/type/fabricType';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

const ChangeFontBtn = ({ canvas, saveState }: ChangeFontBtnProps) => {
  const [open, setOpen] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial');

  const handleFontFamilyChange = (event: SelectChangeEvent<string>) => {

    const newFont = event.target.value;
    setFontFamily(newFont);

    if (!canvas) return;

    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.type === 'textbox') {
      const text = activeObject as fabric.Textbox
      text.set({ fontFamily: newFont });
      canvas.renderAll();
      saveState();
    }

  };
  return (
    <div className='h-full'>
      <button type='button' onClick={() => { setOpen(true) }} className='hover:opacity-75' >
        <div>
          <FontDownloadIcon />
        </div>
        <div>
          <p className='text-white'>
            フォント
          </p>
        </div>
      </button>
      {open &&
        <Select className='absolute' value={fontFamily} onChange={handleFontFamilyChange} open={open}
          onClose={() => setOpen(false)}
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            PaperProps: {
              style: {
                maxHeight: 200, // メニューの最大高さを設定
              },
            },
          }}>
          <MenuItem value="Arial">Arial</MenuItem>
          <MenuItem value="Helvetica">Helvetica</MenuItem>
          <MenuItem value="Times New Roman">Times New Roman</MenuItem>
          <MenuItem value="Courier New">Courier New</MenuItem>
          <MenuItem value="Verdana">Verdana</MenuItem>
        </Select>
      }
    </div>
  )
}

export default ChangeFontBtn
