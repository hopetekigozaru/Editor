"use client";
import { Button, Link, TextField, useTheme } from "@mui/material";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient()
  const router = useRouter();
  const theme = useTheme()




  const sessionRedirect = async () => {
    const { data } = await supabase.auth.getSession();

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
    <>
      <div className=" mt-5 w-full flex justify-center">
        <TextField
          fullWidth
          color="secondary"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full flex justify-center">
        <TextField
          fullWidth
          color="secondary"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mt-5 flex justify-center w-full">
        <Link color="secondary" href='/signup'>アカウントをお持ちでない方はこちら ＞</Link>
      </div>
      <div className="flex justify-center mt-10">
        <Button type="button" variant="contained" color="accent" onClick={handleLogin} disabled={isLoading}>
          ログイン
        </Button>
      </div>
    </>
  );
};

export default Login;
