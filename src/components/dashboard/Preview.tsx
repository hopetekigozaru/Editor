import { useEffect, useState } from "react";

interface PreviewProps {
  svg: string;
}

const Preview: React.FC<PreviewProps> = ({ svg }) => {
  const [svgText,setSvgText] = useState<string>('')
  const fetchSvg = async () => {
    const response = await fetch(svg);
    if (response.ok) {
      const svgText = await response.text();
      setSvgText(svgText)
    } else {
      console.error('Failed to load SVG:', response.statusText);
    }
  }
  useEffect(() => {
    fetchSvg()
  }, [])

  return (
    <div className='svg-container '  >
      {svgText &&
        <div className='svg-content' dangerouslySetInnerHTML={{ __html: svgText }} />
      }
    </div>
  );
};

export default Preview;
