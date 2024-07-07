'use client'

interface PreviewProps {
  keep: {
    uuid: string;
    fabric_object: JSON;
    width: number;
    height: number;
    svg: string;
    created_at: Date;
    updated_at: Date;
  };
}

const Preview: React.FC<PreviewProps> = ({ keep }) => {
  return (
    <a className='svg-container' href={"/edit?keep_id=" + keep.uuid} >
      <div className='svg-content border border-black border-solid' dangerouslySetInnerHTML={{ __html: keep.svg }} />
    </a>
  );
};

export default Preview;
