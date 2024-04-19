import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const POST = async (req: Request): Promise<NextResponse> => {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!req.body)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName") || "newFile";

    const blob = await put(fileName, req.body, {
      access: "public",
    });

    return NextResponse.json(blob, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
