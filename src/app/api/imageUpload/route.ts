import { createClient } from "@/utils/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { v4 } from "uuid";

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
  const supabase = createClient();
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

    return new Response(JSON.stringify(image), {
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
