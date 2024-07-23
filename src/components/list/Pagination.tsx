'use client'

import { Button } from "@mui/material"
import { useState } from "react";

interface PaginarionProps {
  length: number,
  pageSize: number
  totalKeeps: number
}

const Pagination = ({ length, pageSize, totalKeeps }: PaginarionProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  return (
    <div className='flex justify-center h-[5%]'>
      <Button onClick={handlePrevPage} color="secondary" disabled={currentPage === 1}>
        前へ
      </Button>
      <Button onClick={handleNextPage} color="secondary" disabled={length < pageSize || currentPage * pageSize >= totalKeeps}>
        次へ
      </Button>
    </div>
  )
}

export default Pagination