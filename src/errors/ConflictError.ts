import { BaseError } from "./BaseError";

export class ConflictError extends BaseError {
    constructor(
        message: string = "A resource with that identifier already exists"
    ) {
        super(409, message)
    }
}