'use client'

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const PageTitle = () => {
  const pathName = usePathname()
  const [title, setTitle] = useState("");

  useEffect(() => {
    switch (pathName) {
      case '/':
        setTitle('ログイン')
        break;

      case '/signup':
        setTitle('会員登録')
        break;

      case '/signup/pre_register':
        setTitle('仮登録完了')
        break;

      case '/dashboard':
        setTitle('ダッシュボード')
        break;

      case '/register':
        setTitle('新規登録')
        break;

      case '/edit':
        setTitle('編集')
        break;

      default:
        break;
    }
  }, [pathName])
  return (
    <div className="ml-10 text-xl font-bold flex items-center h-full">
      <div className="flex items-center size-full">
      <p>{title}</p>
      </div>
    </div>
  )
}

export default PageTitle