import jwt from "jsonwebtoken";
import { USER_ROLES } from "../models/User";


export interface TokenPayload {
    id:string,
    name:string;
    role:USER_ROLES;
}

export class TokenManager {
    public createToken = (payload:TokenPayload) =>{
        const token = jwt.sign(payload, process.env.JWT_KEY as string, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        })

        return token
    }

    public getPayload = (token:string): TokenPayload | null =>{
        try {
            const payload = jwt.verify(token,process.env.JWT_KEY as string)

            return payload as TokenPayload
        } catch (error) {
            return null
        }
    }
}