
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";


export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams
  const currentPage = Number(search.get('currentPage'))
  const pageSize = Number(search.get('pageSize'))

  const supabase = createRouteHandlerClient({ cookies });
  try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('User ID not found');

      const userId = user.id;

      // Keeps の総数を取得
      const { count } = await supabase
        .from('keeps')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const totalKeeps = count || 0;

      // ページネーションで表示するデータを取得
      const { data: keeps, error } = await supabase
        .from('keeps')
        .select()
        .eq('user_id', userId)
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1)
        .order('created_at');

      if (error) throw error;

    return new Response(JSON.stringify({keeps,totalKeeps}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: error },
      { status: 500 }
    );
  }
}
