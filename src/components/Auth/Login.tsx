"use client";
import useAuth from "@/hooks/Auth/useAuth";
import { Button, Link, TextField, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";


const Login = () => {
  const router = useRouter();
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    isLoading
  } = useAuth(router)

  return (
    <>
      <div className="flex justify-center md:hidden">
        <p className="text-primary text-2xl font-bold">ログイン</p>
      </div>
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
      <div className="mt-5 flex justify-center w-full text-sm md:text-base">
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
