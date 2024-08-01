'use client'
import { Button } from "@mui/material"
import { useRouter } from "next/navigation";

interface PaginarionProps {
  length: number,
  pageSize: number
  totalKeeps: number
  currentPage: number
}

const Pagination = ({ length, pageSize, totalKeeps,currentPage }: PaginarionProps) => {
  const router = useRouter()
  const handlePrevPage = () => {
    router.push('/dashboard/' + (Number(currentPage) - 1))

  };

  const handleNextPage = () => {
    router.push('/dashboard/' + (Number(currentPage) + 1))
  };
  return (
    <div className='flex justify-center h-[5%]'>
      <Button onClick={handlePrevPage} color="secondary" disabled={currentPage == 1}>
        前へ
      </Button>
      <Button onClick={handleNextPage} color="secondary" disabled={length < pageSize || currentPage * pageSize >= totalKeeps}>
        次へ
      </Button>
    </div>
  )
}

export default Pagination