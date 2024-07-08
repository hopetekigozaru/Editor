'use client'
import { Button, TextField } from "@mui/material"
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
      console.log('signup successful')
      router.push('/pre_register')
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
return(
  <div className="w-full h-[90vh] flex justify-center items-center">
  <div>
    <div className="flex justify-center">
      <p className="text-2xl text-black">アカウント登録</p>
    </div>
    <div className=" mt-5">
      <TextField
        className="text-black"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <div className="mt-5">
      <TextField
        className="text-black"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
    <div className="flex justify-center mt-10">
      <Button type="button" variant="outlined" onClick={handleSignUp} disabled={isLoading}>
        登録
      </Button>
    </div>
  </div>
</div>
)
}

export default Singup