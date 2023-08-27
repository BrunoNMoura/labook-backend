import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
    constructor(
        message: string = "invalid token"
    ) {
        super(401, message)
    }
}