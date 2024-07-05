import FontDownloadIcon from '@mui/icons-material/FontDownload';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

interface ChangeFontBtnProps {
  canvas: fabric.Canvas | null;
  activeObj: Object | null;
  saveState: () => void;
}

const ChangeFontBtn = ({canvas,activeObj,saveState}:ChangeFontBtnProps) => {
  const [open, setOpen] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial');

  const handleFontFamilyChange = (event: SelectChangeEvent<string>) => {

    const newFont = event.target.value;
    setFontFamily(newFont);

    if (!canvas) return;

    const activeObject = activeObj as fabric.Textbox | undefined;
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set({ fontFamily: newFont });
      canvas.renderAll();
      saveState();
    }

  };
  return (
    <div className='relative'>
      <button type='button' onClick={() => { setOpen(true) }} >
        <div>
          <FontDownloadIcon />
        </div>
        <div>
          <p className='text-xs'>
            フォント
          </p>
        </div>
      </button>
      {open &&
        <Select className='absolute left-0 top-[-100px] ' value={fontFamily} onChange={handleFontFamilyChange} open={open}
          onClose={() => setOpen(false)}>
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