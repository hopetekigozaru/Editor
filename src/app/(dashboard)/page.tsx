import Preview from '@/components/list/preview';
import { createClient } from '@/utils/supabase/server';

const DashBoard: React.FC = async () => {
  const supabase = createClient();
  const { data: keeps } = await supabase.from("keeps").select();
  return (
    <>
      <div className=' w-full h-[90vh] flex items-center justify-center'>
        <div className='size-full flex flex-wrap'>
          {keeps &&
            keeps.map((keep) => {
              return (
                <div key={keep.uuid} className='flex justify-center w-1/4 h-[50%]'>
                  <div className='h-[75%] aspect-square  mt-5'>
                    <div className='w-full h-full flex flex-col items-center justify-center'>
                      <div className=' w-full text-black'>{keep.title}</div>
                      <Preview keep={keep} />
                      <div className=' w-full text-end text-xs text-gray-400'>{keep.width + '×' + keep.height}</div>
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
