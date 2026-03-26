import { z } from "zod";

export const createContractorCompanySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  logo: z.string().optional(),
});

export type CreateContractorCompanySchema = z.infer<
  typeof createContractorCompanySchema
>;

export const updateContractorCompanySchema = createContractorCompanySchema.extend({
  id: z.string().min(1),
});

export const deleteContractorCompanySchema = z.object({
  id: z.string().min(1),
});
