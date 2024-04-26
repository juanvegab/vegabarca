import { z } from "zod";

export const createTechnologySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  logo: z.string().optional(),
  categories: z
    .array(z.string())
    .min(1, { message: "Categories are required" }),
  isFeatured: z.boolean().optional(),
});

export type CreateTechnologySchema = z.infer<typeof createTechnologySchema>;

export const updateTechnologySchema = createTechnologySchema.extend({
  id: z.string().min(1),
});

export const deleteTechnologySchema = z.object({
  id: z.string().min(1),
});
