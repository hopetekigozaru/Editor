'use client'
import useAuth from "@/hooks/Auth/useAuth";
import { Button, Link, TextField } from "@mui/material"
import { useRouter } from "next/navigation";

const Singup = () => {
  const router = useRouter();
  const { email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSignUp
  } = useAuth(router)
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