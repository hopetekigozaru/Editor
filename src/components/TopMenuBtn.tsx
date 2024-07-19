'use client'

import { usePathname } from "next/navigation"
import RegisterButton from "./list/RegisterButton"
import PageBack from "./fablic/PageBack"
import Logout from "./Auth/Logout"

const TopMenuBtn = () => {
  const pathName = usePathname()

  return (
    <>
      {pathName.includes('/dashboard') &&
        <>
          <RegisterButton />
          <Logout />
        </>
      }
      {(pathName === '/register' || pathName === '/edit') &&
        <PageBack />
      }
    </>
  )
}

export default TopMenuBtn