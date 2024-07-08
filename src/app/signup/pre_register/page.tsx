import { Button, Link } from "@mui/material"

const preRegisterPage = () => {
  return (
    <div className="w-full h-full my-20">
      <div className="text-black flex justify-center">
        <p className="text-3xl">仮登録完了</p>
      </div>
      <div className="text-black flex justify-center mt-5">
        <p className="">ご登録いただいたメールアドレスに本登録を完了させるメールを送付いたしました。</p>
      </div>
      <div className="flex justify-center mt-10">
        <Link href='/'>
        <Button variant="outlined">ログインへ画面へ戻る</Button>
        </Link>
      </div>
    </div>
  )
}
export default preRegisterPage