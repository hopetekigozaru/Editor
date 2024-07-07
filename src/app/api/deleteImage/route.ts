import { createClient } from "@/utils/supabase/server";
import { NextResponse, NextRequest } from "next/server";



export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createClient();
  let result;
  try {
    const { data: files } = await supabase.storage.from('EditorBucket').list('fabric/' + body.uuid);
    if (files) {
      const deleteFiles = files.filter(file => !body.pathArray.includes(file.name));
      for (const file of deleteFiles) {
        const { data, error } = await supabase.storage.from('EditorBucket').remove([file.name]);
        if (error) {
          console.error('Error removing file:', error.message);
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
