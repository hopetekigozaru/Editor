import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const keep = await prisma.keep.create({
      data: {
        fabric_object: body.json,
        title: body.title,
        width: body.width,
        height: body.height,
        svg: body.svg
      },
    });
    console.log(keep)
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
