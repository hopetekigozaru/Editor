'use client'
import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation";

const Logout = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const logout = async () => {

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error;
      router.push('/')
    } catch (error) {
      console.log(error)
      alert('ログアウトに失敗しました')
    }

  }
  return (
    <div>
      <button onClick={logout} className="mr-10">ログアウト</button>
    </div>
  )
}

export default Logout