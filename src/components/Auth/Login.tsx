"use client";
import { Button, Link, TextField } from "@mui/material";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient()
  const router = useRouter();

  const sessionRedirect = async () => {
    const {data} = await supabase.auth.getSession();
    console.log(data.session)
    if (data.session) {
      router.push("/dashboard"); // ダッシュボードページにリダイレクト
    }
  }

  useEffect(() => {
    // ログイン状態を確認し、ログインしていればダッシュボードにリダイレクト
    sessionRedirect()
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      console.log('login successful')
      router.push('/dashboard')
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

  return (
    <div className="w-full h-[90vh] flex justify-center items-center">
      <div>
        <div className="flex justify-center">
          <p className="text-2xl text-black">ログイン</p>
        </div>
        <div className=" mt-5 w-full flex justify-center">
          <TextField
            className="text-black"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-5 w-full flex justify-center">
          <TextField
            className="text-black"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Link className="text-xs" href='/signup'>アカウントをお持ちでない方はこちら</Link>
        </div>
        <div className="flex justify-center mt-10">
          <Button type="button" variant="outlined" onClick={handleLogin} disabled={isLoading}>
            ログイン
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
