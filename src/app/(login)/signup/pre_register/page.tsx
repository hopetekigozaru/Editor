import { Button, Link } from "@mui/material"

const preRegisterPage = () => {
  return (
    <>
      <div className="text-accent flex justify-center">
        <p className="text-3xl">仮登録完了</p>
      </div>
      <div className="text-accent flex justify-center mt-5">
        <p className="text-center">ご登録いただいたメールアドレスに本登録を完了させるメールを送付いたしました。</p>
      </div>
      <div className="flex justify-center mt-10">
        <Link href='/'>
        <Button type="button" variant="contained" color="accent">ログイン画面へ</Button>
        </Link>
      </div>
    </>
  )
}
export default preRegisterPage