import { farms } from "@/utils/data/table.data";
import { Farm } from "@/utils/schemas/farm.schema";

export const getFarms = async (): Promise<Farm[]> => {
    // Mock API call
    return farms;
};