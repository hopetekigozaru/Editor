import { exportImageBtnProps } from '@/type/fabricType';
import ImageIcon from '@mui/icons-material/Image';

const ExportImageBtn = ({ canvas, gridLines, setGridLines, drawGrid }: exportImageBtnProps) => {
  const exportAsImage = () => {
    if (canvas) {
      canvas.discardActiveObject(); // アクティブなオブジェクトの選択を解除
      // Gridを非表示にするために描画コンテキストを取得する
      gridLines.forEach((line) => canvas.remove(line));

      setGridLines([]);

      canvas.renderAll();

      const dataURL = canvas.toDataURL({ format: 'png', quality: 1.0 });

      // ダウンロード用のリンクを作成し、画像データを設定
      const link = document.createElement('a');
      link.download = 'canvas.png';
      link.href = dataURL;

      // リンクをクリックしてダウンロードを開始
      link.click();
      drawGrid(canvas)
      canvas.renderAll();
    }
  };
  return (
    <div className='flex justify-center'>
      <button type='button' onClick={exportAsImage} className='hover:opacity-75'>
        <div>
          <ImageIcon />
        </div>
        <div>
          <p className='text-sm'>
            画像出力
          </p>
        </div>
      </button>
    </div>
  )
}

export default ExportImageBtn
