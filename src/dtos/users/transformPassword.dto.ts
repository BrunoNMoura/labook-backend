import { z } from "zod"

export interface PasswordInputDTO {
    password:string,
    email:string
}


export const PasswordSchema =z.object({
    password: z.string().min(4),
    email: z.string().email()
}).transform(data=>data as PasswordInputDTO)