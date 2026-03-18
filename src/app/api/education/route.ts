import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

const updateEducationSchema = z.object({
  id: z.string(),
  logo: z.string().optional(),
});

export const GET = async () => {
  try {
    const education = await prisma.education.findMany({
      orderBy: { order: "asc" },
    });
    return Response.json(education, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PUT = async (req: Request) => {
  try {
    const { userId } = auth();
    if (!userId)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parseResult = updateEducationSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, logo } = parseResult.data;
    const existing = await prisma.education.findUnique({ where: { id } });
    if (!existing)
      return Response.json({ error: "Education not found" }, { status: 404 });

    const updated = await prisma.education.update({
      where: { id },
      data: { logo },
    });

    return Response.json(updated, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};
