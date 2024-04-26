import { technologiesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import {
  createTechnologySchema,
  deleteTechnologySchema,
  updateTechnologySchema,
} from "@/lib/validation/technology";
import { auth } from "@clerk/nextjs";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const parseResult = createTechnologySchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, isFeatured, logo, categories } = parseResult.data;
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForTechnology(name, categories, logo);

    const technology = await prisma.$transaction(async (tx) => {
      const technology = await tx.technology.create({
        data: {
          name,
          isFeatured,
          logo,
          categories,
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
    const parseResult = updateTechnologySchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, isFeatured, logo, categories, id } = parseResult.data;

    const technology = await prisma.technology.findUnique({ where: { id } });
    if (!technology)
      return Response.json({ error: "Technology not found" }, { status: 404 });

    const embedding = await getEmbeddingForTechnology(name, categories, logo);

    const updatedTechnology = await prisma.$transaction(async (tx) => {
      const updatedTechnology = await tx.technology.update({
        where: { id },
        data: { name, isFeatured, logo, categories },
      });

      await technologiesIndex.upsert([
        {
          id,
          values: embedding,
        },
      ]);

      return updatedTechnology;
    });

    return Response.json({ updatedTechnology }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const body = await req.json();
    const parseResult = deleteTechnologySchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const technology = await prisma.technology.findUnique({ where: { id } });
    if (!technology)
      return Response.json({ error: "Technology not found" }, { status: 404 });

    // this will be validated to only super users
    // const { userId } = auth();

    // if (!userId || userId !== technology.userId) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 });
    // }

    await prisma.$transaction(async (tx) => {
      await tx.technology.delete({ where: { id } });
      await technologiesIndex.deleteOne(id);
    });

    return Response.json({ message: "Technology deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};

const getEmbeddingForTechnology = async (
  title: string,
  categories: string[],
  logo?: string,
) => {
  return getEmbedding(
    title + "\n\n" + categories.join(", ") ?? "" + logo
      ? `\n\n Technology logo url: ${logo}`
      : "",
  );
};
