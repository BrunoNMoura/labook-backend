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
      invalid_type_error: "'q' needs to be string"
    }
  ).min(1,"'q' must be at least 1 character").optional(),
  token: z.string(
    {
      required_error:"'token' is required",
      invalid_type_error: "'token' needs to be string"
    }).min(1), 
}).transform(data => data as GetUsersInputDTO)