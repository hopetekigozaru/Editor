'use client'

import { usePathname, useRouter } from "next/navigation";

const PageBack = () => {
  const router = useRouter();
  const pageBack = () => {
    router.push('/dashboard/1')
  }
  return (
    <div>
      <button onClick={pageBack} className="mr-10 hover:opacity-75">一覧に戻る</button>
    </div>
  )
}

export default PageBack