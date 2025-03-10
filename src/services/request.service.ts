import { requests } from "@/utils/data/table.data";
import { Request } from "@/utils/schemas/request.schema";

export const getRequests = async () => {
    // Mock API call
    return requests;
};

export const getRequestById = async (id: string) => {
    // Mock API call
    return requests.find((request) => request.requestId === id);
};

export const createRequest = async (request: Request) => {
    // Mock API call
    requests.push(request);
    return request;
};

export const updateRequest = async (request: Request) => {
    // Mock API call
    const index = requests.findIndex((req) => req.requestId === request.requestId);
    requests[index] = request;
    return request;
};

export const deleteRequest = async (id: string) => {
    // Mock API call
    const index = requests.findIndex((req) => req.requestId === id);
    requests.splice(index, 1);
    return id;
}
