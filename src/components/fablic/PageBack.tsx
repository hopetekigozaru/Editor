'use client'

import { usePathname, useRouter } from "next/navigation";

const PageBack = () => {
  const router = useRouter();
  const pageBack = () => {
    router.push('/dashboard')
  }
  return (
    <div>
      <button onClick={pageBack} className="mr-10">一覧に戻る</button>
    </div>
  )
}

export default PageBack