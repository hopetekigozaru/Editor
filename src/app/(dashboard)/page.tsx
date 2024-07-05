import Preview from '@/components/list/preview';
import prisma from '@/lib/prisma';
import DeleteIcon from '@mui/icons-material/Delete';

async function getAllKeeps() {
  const keeps = await prisma.keep.findMany();
  return keeps;
}

const DashBoard: React.FC = async () => {
  const allKeeps = await getAllKeeps();
  return (
    <>
      <div className=' w-full h-[90vh] flex items-center justify-center'>
        <div className='size-full flex flex-wrap'>
          {allKeeps &&
            allKeeps.map((keep) => {
              return (
                <div key={keep.id} className='flex justify-center w-1/4 h-[50%]'>
                  <div className='h-[75%] aspect-square  mt-5'>
                    <div className='w-full h-full flex flex-col items-center justify-center'>
                    <div className=' w-full text-black'>{keep.title}</div>
                      <Preview keep={keep} />
                      <div className=' w-full text-end text-xs text-gray-400'>{keep.width + '×' +  keep.height}</div>
                    </div>
                  </div>

                </div>
              )
            })}
        </div>
      </div>
    </>
  );
};

export default DashBoard;
