import { z } from "zod"

export interface GetPostInputDTO {
  token: string 
}

export interface GetPostOutputDTO {
  id: string,  
  content: string,
  likes: number,
  dislikes: number,  
  createdAt: string,
  updatedAt: string 
  creator: {
    id: string,
    name: string
  }
}

export const GetPostShema = z.object(
  {
    token: z.string().min(1)
  }).transform(data => data as GetPostInputDTO)