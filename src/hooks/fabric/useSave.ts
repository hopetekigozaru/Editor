import { keep } from "@/type/fabricType";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const useSave = (
  canvas: fabric.Canvas | null,
  keep: keep | null,
  gridLines: fabric.Line[],
  setGridLines: React.Dispatch<React.SetStateAction<fabric.Line[]>>,
  router: AppRouterInstance,
  setLoading: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const [open, setOpen] = useState(false); // モーダルの開閉状態
  const [title, setTitle] = useState(keep?.title ? keep!.title : "無題"); // 保存するタイトル
  const searchParams = useSearchParams(); // クエリパラメータを取得

  // モーダルを開く関数
  const handleOpen = () => {
    setOpen(true);
  };

  // モーダルを閉じる関数
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * キャンバスを保存するメイン関数
   * @param event - フォーム送信イベント
   */
  const saveCanvas = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // フォームのデフォルトの送信動作をキャンセル
    if (canvas) {
      handleClose(); // モーダルを閉じる
      setLoading('Saving'); // ローディング状態を設定

      // キャンバスの初期設定を行い、画像をアップロード
      const [height, width] = await initialCanvas(canvas);
      const uuid: string = await uploadImage(canvas);
      const json = canvas.toJSON();
      const svgUrl = await uploadSvg(canvas, uuid);

      try {
        let res = null;
        // キャンバスの状態に応じてAPIにデータを送信
        if (json.objects.length > 0) {
          if (keep) {
            // 既存のデータを更新する場合
            const body = JSON.stringify({
              uuid: uuid,
              title: title,
              json: json,
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
            // 新規にデータを登録する場合
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
            router.replace('/dashboard/1'); // ダッシュボードにリダイレクト
          } else {
            throw new Error(`Failed to save canvas data: ${res ? res.status : 'unknown error'}`);
          }
        }
      } catch (error) {
        console.error('Error saving canvas:', error);
        setLoading(null); // ローディング状態をリセット
      }
    }
  };

  /**
   * キャンバスの初期設定を行う関数
   * @param canvas - fabric.Canvas インスタンス
   * @returns [height, width] - 新しい高さと幅
   */
  const initialCanvas = (canvas: fabric.Canvas) => {
    let height: number;
    let width: number;

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]); // ビューポートの変換をリセット

    // GridLineをキャンバスから削除
    gridLines.forEach((line) => {
      canvas.remove(line);
    });
    setGridLines([]); // グリッドラインの状態をリセット

    // 現在のキャンバスサイズを取得
    const currentWidth = canvas.getWidth();
    const currentHeight = canvas.getHeight();

    // 保存するデータがある場合、またはクエリパラメータからサイズを設定
    if (keep) {
      height = keep.height;
      width = keep.width;
    } else {
      height = Number(searchParams.get('height'));
      width = Number(searchParams.get('width'));
    }

    // スケーリング係数を計算
    const scaleX = width / currentWidth;
    const scaleY = height / currentHeight;

    // キャンバスのサイズを設定
    canvas.setHeight(height);
    canvas.setWidth(width);

    // キャンバスの全オブジェクトをスケーリング
    canvas.getObjects().forEach((obj) => {
      obj.scaleX = obj.scaleX! * scaleX;
      obj.scaleY = obj.scaleY! * scaleY;
      obj.left = obj.left! * scaleX;
      obj.top = obj.top! * scaleY;
      obj.setCoords();
    });

    canvas.renderAll(); // キャンバスを再描画

    return [height, width];
  };

  /**
   * 画像をアップロードする関数
   * @param canvas - fabric.Canvas インスタンス
   * @returns uuid - 新しいUUID
   */
  const uploadImage = async (canvas: fabric.Canvas): Promise<string> => {
    const uuid = keep?.uuid ? keep.uuid : uuidv4(); // UUIDを生成または既存のUUIDを使用

    const pathArray: string[] = []; // 画像パスを格納する配列

    const imageObjects = canvas.getObjects('image') as Array<fabric.Image>;
    if (imageObjects.length > 0) {
      try {
        // 画像のアップロード処理
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

        // 古い画像を削除するリクエスト
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
    return uuid;
  };

  /**
   * SVGデータをアップロードする関数
   * @param canvas - fabric.Canvas インスタンス
   * @param uuid - UUID
   * @returns svgUrl - アップロードされたSVGのURL
   */
  const uploadSvg = async (canvas: fabric.Canvas, uuid: string) => {
    const svg = canvas.toSVG(); // SVG形式のデータを取得

    const svgBody = {
      svg,
      uuid
    };

    try {
      // SVGデータをAPIに登録
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
      return svgResponse.publicURL; // SVGの公開URLを返す
    } catch (error) {
      console.error('Error saving canvas:', error);
    }
  };

  return {
    handleOpen,
    open,
    handleClose,
    saveCanvas,
    title,
    setTitle
  };
}

export default useSave;
