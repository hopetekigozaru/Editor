import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface exportPdfBtnProps {
  canvas: fabric.Canvas | null;
  gridLines: fabric.Line[];
  setGridLines: React.Dispatch<React.SetStateAction<fabric.Line[]>>;
  containerElm: HTMLDivElement | null;
  drawGrid: (canvas: fabric.Canvas) => void;
}

const ExportPdfBtn = ({ canvas, gridLines, setGridLines, containerElm, drawGrid }: exportPdfBtnProps) => {

  const exportAsPDF = () => {
    if (canvas && containerElm) {
      canvas.discardActiveObject(); // アクティブなオブジェクトの選択を解除
      // Gridを非表示にするために描画コンテキストを取得する
      gridLines.forEach((line) => canvas.remove(line));

      setGridLines([]);

      canvas.renderAll();

      // html2canvasを使ってCanvasを画像としてキャプチャする
      html2canvas(containerElm, { scale: 1 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // PDFに画像を追加する
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // PDFを保存する
        pdf.save('canvas.pdf');

        // Canvasを再描画してGridを元に戻す
        // この部分はGridを再表示する必要があれば追加する
      });

      drawGrid(canvas)
      canvas.renderAll();
    }
  };

  return (
    <div className='flex justify-center'>
      <button type='button' onClick={exportAsPDF} className='hover:opacity-75'>
        <div>
          <PictureAsPdfIcon/>
        </div>
        <div>
          <p className='text-sm'>
            PDF出力
          </p>
        </div>
      </button>
    </div>
  )
}

export default ExportPdfBtn
