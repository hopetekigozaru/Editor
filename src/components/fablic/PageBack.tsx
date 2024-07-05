'use client'

import { usePathname, useRouter } from "next/navigation";

const PageBack = () => {
  const router = useRouter();
  const pageBack = () => {
    router.back()
  }
  return (
    <div>
      <button onClick={pageBack} className="pr-10">一覧に戻る</button>
    </div>
  )
}

export default PageBack