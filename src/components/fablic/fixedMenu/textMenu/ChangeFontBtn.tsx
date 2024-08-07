import { ChangeFontBtnProps } from '@/type/fabricType';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import { Menu, MenuItem, Button } from '@mui/material';
import { useState } from 'react';

const ChangeFontBtn = ({ canvas, saveState }: ChangeFontBtnProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [fontFamily, setFontFamily] = useState('Arial');

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFontFamilyChange = (newFont: string) => {
    setFontFamily(newFont);
    handleClose();

    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      const text = activeObject as fabric.Textbox;
      text.set({ fontFamily: newFont });
      canvas.renderAll();
      saveState();
    }
  };

  return (
    <div className='h-full'>
      <button type='button' className='hover:opacity-75' onClick={handleClick} >
        <div>
          <FontDownloadIcon />
        </div>
        <div>
          <p className='text-white'>
            フォント
          </p>
        </div>
      </button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => handleFontFamilyChange('Arial')}>Arial</MenuItem>
        <MenuItem onClick={() => handleFontFamilyChange('Helvetica')}>Helvetica</MenuItem>
        <MenuItem onClick={() => handleFontFamilyChange('Times New Roman')}>Times New Roman</MenuItem>
        <MenuItem onClick={() => handleFontFamilyChange('Courier New')}>Courier New</MenuItem>
        <MenuItem onClick={() => handleFontFamilyChange('Verdana')}>Verdana</MenuItem>
      </Menu>
    </div>
  );
};

export default ChangeFontBtn;