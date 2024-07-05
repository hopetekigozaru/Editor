'use client'

import { Prisma } from '@prisma/client';

interface PreviewProps {
  keep: {
    id: number;
    fabric_object: Prisma.JsonValue;
    width: number;
    height: number;
    svg: string;
    created_at: Date;
    updated_at: Date;
  };
}

const Preview: React.FC<PreviewProps> = ({ keep }) => {
  return (
    <a className='svg-container'  href={"/edit?keep_id=" + keep.id}>
      <div className='svg-content border border-black border-solid' dangerouslySetInnerHTML={{ __html: keep.svg }} />
    </a>
  );
};

export default Preview;
