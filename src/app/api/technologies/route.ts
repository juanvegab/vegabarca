import { technologiesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/technology";
import { auth } from "@clerk/nextjs";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const parseResult = createNoteSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { title, content } = parseResult.data;
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNote(title, content);

    const technology = await prisma.$transaction(async (tx) => {
      const technology = await tx.technology.create({
        data: {
          title,
          content,
          userId,
        },
      });

      await technologiesIndex.upsert([
        {
          id: technology.id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return technology;
    });

    return Response.json(technology, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PUT = async (req: Request) => {
  try {
    const body = await req.json();
    const parseResult = updateNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { title, content, id } = parseResult.data;

    const technology = await prisma.technology.findUnique({ where: { id } });
    if (!technology)
      return Response.json({ error: "Note not found" }, { status: 404 });

    const { userId } = auth();

    if (!userId || userId !== technology.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNote(title, content);

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.technology.update({
        where: { id },
        data: { title, content },
      });

      await technologiesIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return updatedNote;
    });

    return Response.json({ updatedNote }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const body = await req.json();
    const parseResult = deleteNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const technology = await prisma.technology.findUnique({ where: { id } });
    if (!technology)
      return Response.json({ error: "Note not found" }, { status: 404 });

    const { userId } = auth();

    if (!userId || userId !== technology.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.technology.delete({ where: { id } });
      await technologiesIndex.deleteOne(id);
    });

    return Response.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};

const getEmbeddingForNote = async (
  title: string,
  content: string | undefined,
) => {
  return getEmbedding(title + "\n\n" + content ?? "");
};
