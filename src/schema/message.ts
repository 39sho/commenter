import z from "zod";

export const comment = z.object({
  id: z.uuid(),
  content: z.string().max(100),
});

export type Comment = z.infer<typeof comment>;
