import z from "zod"

export interface CreatePostInputDTO {
  content: string
  token: string 
}
export interface CreatePostOutputDTO{
  message:string
}
export const CreatePostSchema = z.object({
  content: z.string(
    {
      required_error: "'content' is required",
      invalid_type_error: "'content' must be a string" 
    }
  ).min(1, "'content' must be at least one character"),

  token: z.string() // adicionamos token também no schema
}).transform(data => data as CreatePostInputDTO)