import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
    constructor(
        message: string = "Valid token but not enough permissions"
    ) {
        super(403, message)
    }
}