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
      required_error: "'content' é obrigatória",
      invalid_type_error: "'content' deve ser uma string" 
    }
  ).min(1, "'content' inválido deve ter ao menos um caracter"),

  token: z.string() // adicionamos token também no schema
}).transform(data => data as CreatePostInputDTO)