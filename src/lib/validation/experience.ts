import { z } from "zod";

export const createExperienceSchema = z.object({
  company: z.string().min(1, { message: "Company is required" }),
  companyLogo: z.string().optional(),
  link: z.string().optional(),
  image: z.string().optional(),
  order: z.number().optional(),
  position: z.string().min(1, { message: "Position is required" }),
  techStack: z.array(z.string()).min(1, { message: "Tech stack is required" }),
  content: z.string().optional(),
  visibleSummary: z.string().optional(),
  dates: z.string().min(1, { message: "Dates are required" }),
  isFeatured: z.boolean().optional(),
  contractorCompanyId: z.string().optional(),
});

export type CreateExperienceSchema = z.infer<typeof createExperienceSchema>;

export const updateExperienceSchema = createExperienceSchema.extend({
  id: z.string().min(1),
});

export const deleteExperienceSchema = z.object({
  id: z.string().min(1),
});
