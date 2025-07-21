import z from "zod";

export const comment = z.object({
  content: z.string().max(100),
  user: z.string().max(100),
});
export type Comment = z.infer<typeof comment>;

export const commentWithId = comment.extend({
  id: z.ulid(),
});
export type CommentWithId = z.infer<typeof commentWithId>;
