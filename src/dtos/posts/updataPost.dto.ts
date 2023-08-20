import { z } from "zod"

export interface UpdatePostInputDTO {
  content: string
  token: string
}

export const UpdatePostSchema = z.object(
  {
    content: z.string().min(1),
    token: z.string().min(1)

  }).transform(data => data as UpdatePostInputDTO)