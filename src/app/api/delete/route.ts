
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createRouteHandlerClient({ cookies });
  try {

    const { data: svgFiles } = await supabase.storage.from('EditorBucket').list('svg/' + body.uuid);

    if (svgFiles) {
      for (const file of svgFiles) {
        const { data, error } = await supabase.storage.from('EditorBucket').remove(['svg/' + body.uuid + '/' + file.name]);
        if (error) {
          console.error('Error removing file:', error.message);
        } else {
          console.log('successfully removing file', data)
        }
      }
    }

    const { data: files } = await supabase.storage.from('EditorBucket').list('fabric/' + body.uuid);

    if (files) {
      for (const file of files) {
        const { data, error } = await supabase.storage.from('EditorBucket').remove(['fabric/' + body.uuid + '/' + file.name]);
        if (error) {
          console.error('Error removing file:', error.message);
        } else {
          console.log('successfully removing file', data)
        }
      }
    }

    const { data: keeps, error } = await supabase
      .from('keeps')
      .delete().eq('uuid', body.uuid);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted successfully:', keeps);
    }

    console.log(keeps); // 更新後のデータをログに出力

    return new Response(JSON.stringify(keeps), {
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
