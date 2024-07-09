
interface PreviewProps {
  svg: string;
}

const Preview: React.FC<PreviewProps> = async ({ svg }) => {
  const response = await fetch(svg);
  let svgText
  if (response.ok) {
    svgText = await response.text();
  } else {
    console.error('Failed to load SVG:', response.statusText);
  }
  return (
    <div className='svg-container '  >
      {svgText &&
        <div className='svg-content' dangerouslySetInnerHTML={{ __html: svgText }} />
      }
    </div>
  );
};

export default Preview;
