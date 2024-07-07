
import { createClient } from "@/utils/supabase/server";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createClient();
  try {
    const { data: keeps, error } = await supabase
      .from('keeps')
      .insert([
        {
          uuid: body.uuid,
          fabric_object: body.json,
          title: body.title,
          width: body.width,
          height: body.height,
          svg: body.svg
        }
      ]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted successfully:', keeps);
    }

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
