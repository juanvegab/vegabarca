import prisma from "@/lib/db/prisma";
import {
  createContractorCompanySchema,
  deleteContractorCompanySchema,
  updateContractorCompanySchema,
} from "@/lib/validation/contractorCompany";
import { auth } from "@clerk/nextjs";

export const GET = async () => {
  try {
    const companies = await prisma.contractorCompany.findMany({
      orderBy: { name: "asc" },
    });
    return Response.json(companies, { status: 200 });
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
    const parseResult = createContractorCompanySchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, logo } = parseResult.data;
    const company = await prisma.contractorCompany.create({
      data: { name, logo },
    });
    return Response.json(company, { status: 201 });
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
    const parseResult = updateContractorCompanySchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, name, logo } = parseResult.data;
    const existing = await prisma.contractorCompany.findUnique({ where: { id } });
    if (!existing)
      return Response.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.contractorCompany.update({
      where: { id },
      data: { name, logo },
    });
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
    const parseResult = deleteContractorCompanySchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;
    const existing = await prisma.contractorCompany.findUnique({ where: { id } });
    if (!existing)
      return Response.json({ error: "Not found" }, { status: 404 });

    await prisma.contractorCompany.delete({ where: { id } });
    return Response.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};
