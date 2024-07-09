import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";
import { v4 } from "uuid";
import { cookies } from "next/headers";
import { fabric } from 'fabric';

function base64ToBlob(base64String: string) {
  const contentType = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1];

  const byteCharacters = atob(base64String.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType })
}


export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createRouteHandlerClient({ cookies });
  const blob = base64ToBlob(body.src)
  const uuid = v4()
  try {

    const { data: image, error } = await supabase.storage
      .from('EditorBucket').upload('fabric/' + body.uuid + '/' + uuid, blob, {
        contentType: blob.type // ここで適切な MIME タイプを指定する
      })

    if (error) {
      console.error('Error imageUpload data:', error);
    } else {
      console.log('Data imageUpload successfully:', image);
    }

    const publicURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/EditorBucket/fabric/${body.uuid}/${uuid}`;

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
