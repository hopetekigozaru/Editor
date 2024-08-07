import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ルートが読み込まれる直前に実行
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // クライアント作成
  const supabase = createMiddlewareClient({ req, res });

  // 有効期限が切れたセッションを更新
  const { data: { session } } = await supabase.auth.getSession();
  // セッションがない場合はログインページにリダイレクト
  if (!session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// 特定のパスに対してミドルウェアを適用
export const config = {
  matcher: ['/dashboard/:path*', '/edit/:path*', '/register/:path*'],
};
