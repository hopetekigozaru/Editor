'use client'
import { Button } from "@mui/material"
import { useRouter } from "next/navigation"

interface PaginationProps {
  pageSize: number | null
  totalKeeps: number
  currentPage: number
}

const Pagination = ({ pageSize, totalKeeps, currentPage }: PaginationProps) => {
  const router = useRouter()
  if (!pageSize) return null;

  const handlePrevPage = () => {
    router.push(`/dashboard/${currentPage - 1}`);
  };

  const handleNextPage = () => {
    router.push(`/dashboard/${currentPage + 1}`);
  };

  return (
    <div className='flex justify-center h-[5%]'>
      <Button onClick={handlePrevPage} color="secondary" disabled={currentPage <= 1}>
        <p className="text-xl font-bold">＜</p>
      </Button>
      <p className="text-xl text-primary font-bold mx-5">{currentPage}</p>
      <Button onClick={handleNextPage} color="secondary" disabled={totalKeeps <= pageSize || currentPage * pageSize >= totalKeeps}>
      <p className="text-xl font-bold">＞</p>
      </Button>
    </div>
  )
}

export default Pagination