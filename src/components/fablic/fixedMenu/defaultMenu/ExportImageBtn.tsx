import ImageIcon from '@mui/icons-material/Image';

interface exportImageBtnProps {
canvas: fabric.Canvas | null;
gridLines: fabric.Line[];
setGridLines: React.Dispatch<React.SetStateAction<fabric.Line[]>>;
drawGrid: (canvas: fabric.Canvas) => void;
}

const ExportImageBtn = ({canvas,gridLines,setGridLines,drawGrid}:exportImageBtnProps) => {
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
    <div>
      <button type='button' onClick={exportAsImage}>
        <div>
          <ImageIcon />
        </div>
        <div>
          <p className='text-xs'>
            画像として出力
          </p>
        </div>
      </button>
    </div>
  )
}

export default ExportImageBtn