import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { Box, Button, Modal, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface SaveBtnProps {
  canvas: fabric.Canvas | null;
  width: number;
  height: number;
  gridLines: fabric.Line[];
  setGridLines: React.Dispatch<React.SetStateAction<fabric.Line[]>>;
  drawGrid: (canvas: fabric.Canvas) => void;
  keep: {
    uuid: string;
    title: string
    fabric_object: fabric.Object | null; // fabric_objectがnullになる可能性も考慮
    width: number;
    height: number;
  } | null;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '20px',
  pt: 2,
  px: 4,
  pb: 3,
};

const SaveBtn = ({ canvas, width, height, setGridLines, gridLines, drawGrid, keep }: SaveBtnProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(keep?.title ? keep!.title : "無題")

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveCanvas = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canvas) {

      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

      gridLines.map((line) => {
        canvas.remove(line)
      })
      setGridLines([])
      let uuid;
      if (keep) {
        uuid = keep.uuid
      } else {
        uuid = uuidv4()
      }

      let pathArray: string[] = [];

      canvas.getObjects('image').forEach(async (obj: any) => {
        const img = obj as fabric.Image; // 型アサーションを使用して fabric.Image 型にキャストする
        const src = img.getSrc();
        if (src.startsWith('data:image')) {
          const res = await fetch('/api/imageUpload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ src: src, uuid: uuid }),
          });
          const jsonRes = await res.json();
          console.log(jsonRes)
          const path = jsonRes.fullPath
          img.setSrc(path)
          pathArray.push(path)
          canvas.renderAll();
        } else if (src.startsWith('http://') || src.startsWith('https://')) {
          pathArray.push(src)
        }

      });
      // const deleteImg = await fetch('api/deleteImage', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(pathArray),

      // })

      const json = canvas.toJSON()
      const svg = canvas.toSVG();

      if (json.objects.length > 0) {
        let res = null;

        if (keep) {
          const body = JSON.stringify({
            uuid: uuid,
            title: title,
            json: json,
            width: keep.width,
            height: keep.height,
            svg: svg
          });

          res = await fetch('/api/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: body,
          });
        } else {
          const body = JSON.stringify({
            uuid: uuid,
            json: json,
            width: width,
            height: height,
            svg: svg,
            title: title
          });

          res = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: body,
          });
        }
        console.log(res.status)
        if (res && res.status == 200) {
          router.push('/');
        }
      }
      drawGrid(canvas)
    }
  }
  return (
    <div>
      <button type='button' className='cursor-pointer' onClick={handleOpen} >
        <div className='flex justify-center'>
          <SaveAltIcon />
        </div>
        <div>
          <p className='text-xs'>
            保存
          </p>
        </div>
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: '50vw' }}>
          <div className="w-full flex flex-col justify-center my-10">
            <form onSubmit={saveCanvas}>
              <div className='flex justify-center'>
                <TextField variant='outlined' value={title} onChange={(e) => setTitle(e.target.value)} label="タイトル" required />
              </div>
              <div className="flex justify-center mt-5">
                <Button type='submit' variant="outlined">保存する</Button>
              </div>

            </form>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default SaveBtn
