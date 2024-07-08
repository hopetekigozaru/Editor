'use client';

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import Preview from "./preview";
import { Button } from "@mui/material";

const PAGE_SIZE = 8; // 1ページに表示するアイテム数

const Dashboard = () => {
  const [keeps, setKeeps] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalKeeps, setTotalKeeps] = useState<number>(0); // 全てのアイテム数を管理する state
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchKeeps() {
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

        const totalCount = countData?.[0]?.count || 0;
        setTotalKeeps(totalCount);

        // ページネーションで表示するデータを取得
        const { data: fetchedKeeps, error } = await supabase
          .from('keeps')
          .select()
          .eq('user_id', data.user.id)
          .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);

        if (error) {
          throw error;
        }

        if (fetchedKeeps) {
          setKeeps(fetchedKeeps);
        }
      } catch (error: unknown) {
        console.error('Error fetching keeps:', error);
      }
    }

    fetchKeeps();
  }, [supabase, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <div className='w-full h-[85vh] flex items-center justify-center'>
        <div className='size-full flex flex-wrap'>
          {keeps.map((keep) => (
            <div key={keep.uuid} className='flex justify-center items-center w-full md:w-1/4 h-[50%]'>
              <div className='h-[65%] aspect-square mt-5'>
                <div className='w-full h-full flex flex-col items-center justify-center'>
                  <div className='w-full text-black'>{keep.title}</div>
                  <Preview keep={keep} />
                  <div className='w-full text-end text-xs text-gray-400'>{keep.width + '×' + keep.height}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-center h-[5vh]'>
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          前へ
        </Button>
        <Button onClick={handleNextPage} disabled={keeps.length < PAGE_SIZE || currentPage * PAGE_SIZE >= totalKeeps}>
          次へ
        </Button>
      </div>
    </>
  );
};

export default Dashboard;
