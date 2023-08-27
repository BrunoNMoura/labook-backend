import z from "zod"
import { USER_ROLES } from "../../models/User"

export interface GetUsersInputDTO {
  q: string
  token: string
}

export interface GetUsersOutputDTO {
  id: string,
  name: string,
  email: string,
  role: USER_ROLES,
  createdAt: string
}

export const GetUsersSchema = z.object({
  q: z.string(
    {
      invalid_type_error: "'q' precisa ser string"
    }
  ).min(1,"'q' precisa ter pelomenos 1 caracter").optional(),
  token: z.string(
    {
      required_error:"'token' é obrigatório",
      invalid_type_error: "'token' precisa ser string"
    }).min(1,"'token' precisa ter pelomenos 1 caracter"), 
}).transform(data => data as GetUsersInputDTO)