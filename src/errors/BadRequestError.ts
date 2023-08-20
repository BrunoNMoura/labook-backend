import { BaseError } from "./BaseError";


export class BadRequestError extends BaseError {
    constructor(
        message: string = "Requesição inválida"
    ){
        super(400,message)
    }
}