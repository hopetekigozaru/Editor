'use client'
import useAuth from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();
  const {logout} = useAuth(router);
  return (
    <div>
      <button onClick={logout} className="mr-10 text-xl hover:opacity-75">ログアウト</button>
    </div>
  )
}

export default Logout
