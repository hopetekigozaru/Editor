import Pagination from "@/components/list/Pagination";
import Preview from "@/components/list/preview";
import RegisterButtonSp from "@/components/list/RegisterButtonSp";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const PAGE_SIZE = 8; // 1ページに表示するアイテム数

interface DashBoardProps {
  params: { page_index: number }
}

const DashBoard: React.FC<DashBoardProps> = async ({ params }) => {
  const supabase = createServerComponentClient({ cookies });
  let keeps
  let totalKeeps
  let currentPage = params.page_index

  try {
    const { data } = await supabase.auth.getUser();
    if (!data?.user?.id) {
      throw new Error('User ID not found');
    }

    // Keeps の総数を取得
    const { data: countData, error: countError } = await supabase
      .from('keeps')
      .select('count', { count: 'exact' })
      .eq('user_id', data.user.id);

    if (countError) {
      throw countError;
    }

    totalKeeps = countData?.[0]?.count || 0;

    // ページネーションで表示するデータを取得
    const { data: fetchKeeps, error } = await supabase
      .from('keeps')
      .select()
      .eq('user_id', data.user.id)
      .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);

    if (error) {
      throw error;
    }

    keeps = fetchKeeps

  } catch (error: unknown) {
    console.error('Error fetching keeps:', error);
  }

  return (
    <>
      <div className='w-full h-[90%] md:h-[85%] flex items-center justify-center '>
        <div className='size-full grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-y-10 gap-x-5 p-5 overflow-scroll'>
          {keeps &&
            keeps.map((keep) => (
              <a href={"/edit?keep_id=" + keep.uuid} key={keep.uuid} className='flex justify-centerw-1/4 border-primary border-4 border-solid rounded-2xl hover:opacity-65'>
                <div className='h-full w-full flex justify-center'>
                  <div className='w-full h-full'>
                    <div className="flex justify-center h-[20%] border-primary border-b-4 border-solid">
                      <div className='w-11/12 flex justify-between items-center h-full '>
                        <div className='w-full text-primary font-bold'>{keep.title}</div>
                        <div className='w-full text-end text-sm text-gray-400'>{keep.width + '×' + keep.height}</div>
                      </div>

                    </div>
                    <Preview svg={keep.svg} />
                  </div>
                </div>
              </a>
            ))}
        </div>
      </div>
      {(keeps && totalKeeps > 8) &&
        <Pagination length={keeps.length} pageSize={PAGE_SIZE} totalKeeps={totalKeeps} />
      }
      <RegisterButtonSp/>
    </>
  );
};

export default DashBoard;
