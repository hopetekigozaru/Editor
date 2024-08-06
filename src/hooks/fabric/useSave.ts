import { keep } from "@/type/fabricType";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const useSave = (canvas: fabric.Canvas | null, keep: keep | null, gridLines: fabric.Line[], setGridLines: React.Dispatch<React.SetStateAction<fabric.Line[]>>, router: AppRouterInstance, setLoading: React.Dispatch<React.SetStateAction<string | null>>) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(keep?.title ? keep!.title : "無題")
  const searchParams = useSearchParams();


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  /**
   * キャンバスを保存するメイン関数
   * @param event
   */
  const saveCanvas = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canvas) {
      handleClose()
      setLoading('Saving')
      const [height, width] = await initialCanvas(canvas)

      const uuid: string = await uploadImage(canvas)

      const json = canvas.toJSON();

      const svgUrl = await uploadSvg(canvas, uuid)

      try {
        let res = null;
        if (json.objects.length > 0) {
          if (keep) {
            const body = JSON.stringify({
              uuid: uuid,
              title: title,
              json: json,
              width: width,
              height: height,
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

          if (res && res.status === 200) {
            router.push('/dashboard/1');
          } else {
            throw new Error(`Failed to save canvas data: ${res ? res.status : 'unknown error'}`);
          }
        }
      } catch (error) {
        console.error('Error saving canvas:', error);
        setLoading(null)
      }
    }
  };


  /**
   * キャンバスを保存するときの初期設定
   * @param canvas
   * @returns [height,width]
   */
  const initialCanvas = (canvas: fabric.Canvas) => {
    let height: number;
    let width: number;

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    // CanvasからGridLineを削除
    gridLines.forEach((line) => {
      canvas.remove(line);
    });
    setGridLines([]);

    // 現在のCanvasのサイズを取得
    const currentWidth = canvas.getWidth();
    const currentHeight = canvas.getHeight();



    // 新しいCanvasの高さ・幅を設定
    if (keep) {
      height = keep.height;
      width = keep.width;
    } else {
      height = Number(searchParams.get('height'));
      width = Number(searchParams.get('width'));
    }

    const scaleX = width / currentWidth
    const scaleY = height / currentHeight

    // Canvasのサイズを設定
    canvas.setHeight(height);
    canvas.setWidth(width);

    // Canvasの全オブジェクトをスケーリング
    canvas.getObjects().forEach((obj) => {
      obj.scaleX = obj.scaleX! * scaleX;
      obj.scaleY = obj.scaleY! * scaleY;
      obj.left = obj.left! * scaleX;
      obj.top = obj.top! * scaleY;
      obj.setCoords();
    });

    canvas.renderAll();

    return [height, width];
  }

  /**
   * imageのアップロード関数
   * @param canvas
   * @returns uuid
   */
  const uploadImage = async (canvas: fabric.Canvas): Promise<string> => {
    const uuid = keep?.uuid ? keep.uuid : uuidv4();

    const pathArray: string[] = [];

    const imageObjects = canvas.getObjects('image') as Array<fabric.Image>;
    if (imageObjects.length > 0) {
      try {

        const uploadPromises = imageObjects.map(async (img) => {
          const src = img.getSrc();
          if (src.startsWith('data:image')) {
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

            await new Promise<void>((resolve, reject) => {
              img.setSrc(url, resolve, { crossOrigin: 'Anonymous' });
            });

            pathArray.push(path);
          } else if (src.startsWith('http://') || src.startsWith('https://')) {
            const trimmedSrc = src.replace(process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/EditorBucket/', '');
            pathArray.push(trimmedSrc);
          }
        });

        await Promise.all(uploadPromises);

        const deleteBody = {
          pathArray,
          uuid
        };

        const deleteImgResponse = await fetch('api/deleteImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deleteBody),
        });

        if (!deleteImgResponse.ok) {
          throw new Error(`Failed to delete image: ${deleteImgResponse.status}`);
        }

      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    return uuid
  }


  /**
   * svgアップロード関数
   * @param canvas
   * @param uuid
   * @returns svgUrl
   */
  const uploadSvg = async (canvas: fabric.Canvas, uuid: string) => {
    const svg = canvas.toSVG();

    const svgBody = {
      svg,
      uuid
    };

    try {
      const registerSVG = await fetch('api/svg/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(svgBody),
      });

      if (!registerSVG.ok) {
        throw new Error(`Failed to register SVG: ${registerSVG.status}`);
      }

      const svgResponse = await registerSVG.json();
      return svgResponse.publicURL;
    } catch (error) {
      console.error('Error saving canvas:', error);
    }
  }


  return {
    handleOpen,
    open,
    handleClose,
    saveCanvas,
    title,
    setTitle
  }
}

export default useSave