import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";

const useAuth = (router:AppRouterInstance) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient()

  const sessionRedirect = async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      router.push("/dashboard/1"); // ダッシュボードページにリダイレクト
    }
  }

  useEffect(() => {
    // ログイン状態を確認し、ログインしていればダッシュボードにリダイレクト
    sessionRedirect()
  }, [sessionRedirect]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      console.log('login successful')
      router.push('/dashboard/1')
    } catch (error: unknown) { // unknown 型を指定してエラーメッセージを取得
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      router.push('/signup/pre_register')
    } catch (error: unknown) { // unknown 型を指定してエラーメッセージを取得
      if (error instanceof Error) {
        console.error(error.message)
        alert(error.message);
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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

return {
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  isLoading,
  handleSignUp,
  logout
}

}

export default useAuth