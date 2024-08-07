
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";


export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createRouteHandlerClient({ cookies });
  let result;
  try {
    const { data: files } = await supabase.storage.from('EditorBucket').list('fabric/' + body.uuid);
    if (files) {
      const deleteFiles = files.filter(file => !body.pathArray.includes('fabric/' + body.uuid + '/' + file.name));
      console.log(deleteFiles)
      for (const file of deleteFiles) {
        const { data, error } = await supabase.storage.from('EditorBucket').remove(['fabric/' + body.uuid + '/' + file.name]);
        if (error) {
          console.error('Error removing file:', error.message);
        } else {
          console.log('successfully removing file', data)
        }
        result = data
      }
    }


    return new Response(JSON.stringify(result), {
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
