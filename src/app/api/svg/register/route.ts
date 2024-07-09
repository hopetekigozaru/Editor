import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";
import { v4 } from "uuid";
import { cookies } from "next/headers";


export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createRouteHandlerClient({ cookies });
  const uuid = v4()
  const fileName = 'svg/' + body.uuid + '/' + uuid + '.svg'
  try {

    const { data: files } = await supabase.storage.from('EditorBucket').list('svg/' + body.uuid);
    if (files) {
      for (const file of files) {
        const { data, error } = await supabase.storage.from('EditorBucket').remove(['fabric/' + body.uuid + '/' + file.name]);
        if (error) {
          console.error('Error removing svg:', error.message);
        } else {
          console.log('successfully removing svg')
        }
      }
    }

    const { data: image, error } = await supabase.storage
      .from('EditorBucket').upload(fileName, body.svg, {
        contentType: 'image/svg+xml' // ここで適切な MIME タイプを指定する
      })

    if (error) {
      console.error('Error imageUpload data:', error);
    } else {
      console.log('Data imageUpload successfully:', image);
    }

    const publicURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/EditorBucket/${fileName}`;

    return new Response(JSON.stringify({ image, publicURL }), {
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
