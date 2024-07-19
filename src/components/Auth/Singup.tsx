'use client'
import { Button, Link, TextField } from "@mui/material"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

import { useState } from "react";

const Singup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient()
  const router = useRouter();

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
  return (
    <>
      <div className="flex justify-center md:hidden">
        <p className="text-primary text-2xl font-bold">サインアップ</p>
      </div>
      <div className="mt-5 flex justify-center">
        <TextField
          fullWidth
          type="email"
          color="secondary"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mt-5 flex justify-center">
        <TextField
          fullWidth
          color="secondary"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mt-5 flex justify-center w-full md:text-base text-[0.8rem]">
        <Link color="secondary" href='/'>すでにアカウントをお持ちの方はこちら ＞</Link>
      </div>
      <div className="flex justify-center mt-10">
        <Button type="button" variant="contained" color="accent" onClick={handleSignUp} disabled={isLoading}>
          サインアップ
        </Button>
      </div>
    </>

  )
}

export default Singup