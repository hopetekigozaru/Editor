'use client'

import { usePathname } from "next/navigation"
import RegisterButton from "./list/RegisterButton"
import PageBack from "./fablic/PageBack"

const TopMenuBtn = () => {
  const pathName = usePathname()
  console.log(pathName)
  return (
    <>
      {pathName === '/' &&
        <RegisterButton />
      }
      {(pathName === '/register' || pathName === '/edit' )&&
        <PageBack/>
      }
    </>
  )
}

export default TopMenuBtn