import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const keep = await prisma.keep.update({
      where: { id: body.id }, // 更新するレコードをIDで特定
      data: {
        fabric_object: body.json,
        width: body.width,
        height: body.height,
        svg: body.svg,
        title: body.title
      },
    });

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
