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

      const pathArray: string[] = [];
      for (const obj of canvas.getObjects('image')) {
        const img = obj as fabric.Image;
        const src = img.getSrc();
        if (src.startsWith('data:image')) {
          try {
            const res = await fetch('/api/imageUpload', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ src: src, uuid: uuid }),
            });
            if (!res.ok) {
              throw new Error(`Failed to upload image: ${res.status}`);
            }
            const jsonRes = await res.json();
            const path = jsonRes.image.path;
            const url = jsonRes.publicURL;

            // setSrcをPromiseでラップし、完了後にrenderAllを呼ぶ
            await new Promise<void>((resolve, reject) => {
              img.setSrc(url, () => {
                canvas.renderAll();
                resolve();
              });
            });

            pathArray.push(path);
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        } else if (src.startsWith('http://') || src.startsWith('https://')) {
          const trimmedSrc = src.replace(process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/EditorBucket/', '');
          console.log(trimmedSrc);
          pathArray.push(trimmedSrc);
        }
      }
      const deleteBody = {
        pathArray,
        uuid
      }

      // 画像の削除処理
      const deleteImgResponse = await fetch('api/deleteImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deleteBody),
      });




      // 削除が成功したかどうかを確認
      if (deleteImgResponse.ok) {
        console.log('Images deleted successfully:', pathArray);
      } else {
        console.error('Failed to delete images:', deleteImgResponse.status);
        return;
      }
      const json = canvas.toJSON()
      const svg = canvas.toSVG();

      const svgBody = {
        svg,
        uuid
      }

      console.log(svgBody)

      const registerSVG = await fetch('api/svg/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(svgBody),
      });

      const svgResponse = await registerSVG.json()
      const svgUrl = svgResponse.publicURL;

      if (json.objects.length > 0) {
        let res = null;

        if (keep) {
          const body = JSON.stringify({
            uuid: uuid,
            title: title,
            json: json,
            width: keep.width,
            height: keep.height,
            svg: svgUrl
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
            svg: svgUrl,
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
          router.push('/dashboard/1');
        }
      }
      drawGrid(canvas)
    }
  }
  return (
    <div>
      <button type='button' className='cursor-pointer hover:opacity-75' onClick={handleOpen} >
        <div className='flex justify-center'>
          <SaveAltIcon />
        </div>
        <div>
          <p className='text-xs'>
            一時保存
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
                <TextField variant='outlined' color='secondary' value={title} onChange={(e) => setTitle(e.target.value)} label="タイトル" required />
              </div>
              <div className="flex justify-center mt-5">
                <Button type='submit' variant="contained" color='secondary'>保存する</Button>
              </div>

            </form>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default SaveBtn
