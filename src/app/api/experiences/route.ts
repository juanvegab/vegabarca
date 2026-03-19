import { experiencesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import {
  createExperienceSchema,
  deleteExperienceSchema,
  updateExperienceSchema,
} from "@/lib/validation/experience";
import { auth } from "@clerk/nextjs";

type ExperienceToEmbed = {
  position: string;
  company: string;
  dates: string;
  techStack: string[];
  content?: string | undefined;
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const parseResult = createExperienceSchema.safeParse(body);

    // request body validation and parsing
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const {
      position,
      company,
      companyLogo,
      link,
      order,
      dates,
      techStack,
      content,
    } = parseResult.data;
    const { userId } = auth();

    // authenthincation validation and authorization
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const experience = await prisma.experience.create({
      data: {
        position,
        company,
        companyLogo,
        link,
        order,
        dates,
        techStack,
        content,
      },
    });

    // Embedding is best-effort — don't fail the request if it errors
    try {
      const embedding = await getEmbeddingForExperience(parseResult.data);
      await experiencesIndex.upsert([
        {
          id: experience.id,
          values: embedding,
          metadata: { userId },
        },
      ]);
    } catch (embeddingError) {
      console.error("Embedding/Pinecone error (non-fatal):", embeddingError);
    }

    // Correct response
    return Response.json(experience, { status: 201 });
  } catch (error) {
    console.error(error);
    // Error handling
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PUT = async (req: Request) => {
  try {
    const body = await req.json();
    const parseResult = updateExperienceSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const {
      position,
      company,
      companyLogo,
      link,
      order,
      dates,
      techStack,
      content,
      id,
    } = parseResult.data;

    const experience = await prisma.experience.findUnique({ where: { id } });

    // Check if experience exists
    if (!experience)
      return Response.json({ error: "Experience not found" }, { status: 404 });

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedExperience = await prisma.experience.update({
      where: { id },
      data: {
        position,
        company,
        companyLogo,
        link,
        order,
        dates,
        techStack,
        content,
      },
    });

    // Embedding is best-effort — don't fail the request if it errors
    try {
      const embedding = await getEmbeddingForExperience(parseResult.data);
      await experiencesIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);
    } catch (embeddingError) {
      console.error("Embedding/Pinecone error (non-fatal):", embeddingError);
    }

    return Response.json({ updatedExperience }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const body = await req.json();
    const parseResult = deleteExperienceSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const experience = await prisma.experience.findUnique({ where: { id } });
    if (!experience)
      return Response.json({ error: "Experience not found" }, { status: 404 });

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.experience.delete({ where: { id } });
      await experiencesIndex.deleteOne(id);
    });

    return Response.json({ message: "Experience deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};

export const PATCH = async (req: Request) => {
  try {
    const { userId } = auth();
    if (!userId)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { orders } = (await req.json()) as {
      orders: { id: string; order: number }[];
    };

    if (!Array.isArray(orders))
      return Response.json({ error: "Invalid input" }, { status: 400 });

    await prisma.$transaction(
      orders.map(({ id, order }) =>
        prisma.experience.update({ where: { id }, data: { order } }),
      ),
    );

    return Response.json({ message: "Order updated" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};

const getEmbeddingForExperience = async ({
  position,
  company,
  dates,
  techStack,
  content,
}: ExperienceToEmbed) => {
  return getEmbedding(
    `${position} at ${company}` +
      `Dates: ${dates}` +
      "\n" +
      `Used tecnologies: ${techStack.join(", ")}` +
      "\n\n" +
      `${content}`,
  );
};
