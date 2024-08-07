'use client'
import Pagination from "@/components/dashboard/Pagination";
import Preview from "@/components/dashboard/Preview";
import RegisterButtonMb from "@/components/dashboard/RegisterButtonMb";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";

interface keepProps {
  uuid: string;
  title: string;
  fabric_object: fabric.Object | null;
  width: number;
  height: number;
  svg: string;
}

interface keepObjectProps {
  totalKeeps: number;
  keeps: Array<keepProps>;
}

const Dashboard = ({ currentPage }: { currentPage: number }) => {
  const [keepObject, setKeepObject] = useState<keepObjectProps>({ totalKeeps: 0, keeps: [] });
  const router = useRouter()

  const pageSize = useMemo(() => {
    return typeof window !== 'undefined' ? (window.innerWidth < window.innerHeight ? 2 : 8) : 8;
  }, []);

  const getKeeps = useCallback(async () => {
    try {
      const res = await fetch(`/api/getKeeps?currentPage=${currentPage}&pageSize=${pageSize}`);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await res.json();
      if(json.keeps.length == 0) router.push('/dashboard/1')
        console.log(1)

      setKeepObject(json);
    } catch (error) {
      console.error('Failed to fetch keeps:', error);
    }
  }, [currentPage, pageSize,router]);

  useEffect(() => {
    getKeeps();
  }, [getKeeps]);


  return (
    <>
      <div className='w-full h-[80%] flex items-center justify-center '>
        <div className='size-full grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-y-5 gap-x-5 p-5'>
          {keepObject.keeps.map((keep) => (
            <a href={"/edit?keep_id=" + keep.uuid} key={keep.uuid} className='flex justify-center h-full border-primary border-4 border-solid rounded-2xl hover:opacity-65'>
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
      <Pagination
        currentPage={Number(currentPage)}
        pageSize={pageSize}
        totalKeeps={keepObject.totalKeeps}
      />
      <RegisterButtonMb />
    </>
  )
}

export default Dashboard