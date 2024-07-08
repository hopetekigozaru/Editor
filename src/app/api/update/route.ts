
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createRouteHandlerClient({cookies});
  try {
    const { data: keep, error } = await supabase
      .from('keeps')
      .update([
        {
          fabric_object: body.json,
          title: body.title,
          width: body.width,
          height: body.height,
          svg: body.svg
        }
      ]).eq('uuid', body.uuid);

    if (error) {
      console.error('Error updating data:', error);
    } else {
      console.log('Data inserted successfully:', keep);
    }

    console.log(keep); // 更新後のデータをログに出力

    return new Response(JSON.stringify(keep), {
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
