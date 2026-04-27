export type AppError = {
    statusCode: number;
    code: string;
    message: string;
}

export const notFound = (resource: string): AppError => ({
    statusCode: 404,
    code: "NOT_FOUND",
    message: `${resource} not found`
})

export const alreadyExist = (resource: string): AppError => ({
    statusCode: 409,
    code: "ALREADY_EXIST",
    message: `${resource} already exist`
})

export const unprocessableEntity = (resource: string): AppError => ({
    statusCode: 422,
    code: "UNPROCCESABLE_ENTITY",
    message: `You cannot procces more ${resource}`
})

export const tooManyRequest = (resource: string): AppError => ({
    statusCode: 429,
    code: "TOO_MANY_REQUEST",
    message: `${resource} too man request`
})

export const internalError = (): AppError => ({
    statusCode: 500,
    code: "INTERNAL_ERROR",
    message: "Internal server error"
})
