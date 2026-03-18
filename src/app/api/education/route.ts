import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

const createEducationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  period: z.string().min(1),
  logo: z.string().optional(),
  highlight: z.boolean().default(false),
  order: z.number().default(0),
});

const updateEducationSchema = createEducationSchema.partial().extend({
  id: z.string(),
});

const deleteEducationSchema = z.object({
  id: z.string(),
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

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();
    if (!userId)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parseResult = createEducationSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const created = await prisma.education.create({ data: parseResult.data });
    return Response.json(created, { status: 201 });
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

    const { id, ...data } = parseResult.data;
    const existing = await prisma.education.findUnique({ where: { id } });
    if (!existing)
      return Response.json({ error: "Education not found" }, { status: 404 });

    const updated = await prisma.education.update({ where: { id }, data });
    return Response.json(updated, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { userId } = auth();
    if (!userId)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parseResult = deleteEducationSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;
    const existing = await prisma.education.findUnique({ where: { id } });
    if (!existing)
      return Response.json({ error: "Education not found" }, { status: 404 });

    await prisma.education.delete({ where: { id } });
    return Response.json({ message: "Education deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};
