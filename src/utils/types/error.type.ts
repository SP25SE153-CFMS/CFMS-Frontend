import { Response } from "./response.type";

export interface ErrorType {
    response: {
        data: Response<string>
    }
    status: number
}