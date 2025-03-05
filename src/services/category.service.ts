import { categories, subCategories } from "@/utils/data/table.data";
import { Category } from "@/utils/schemas/category.schema";

export const getCategories = async (): Promise<Category[]> => {
    // Mock API call
    const data = categories.map((category) => (
        {
            ...category,
            subCategory: subCategories.filter((subCategory) => subCategory.categoryId === category.categoryId)
        }
    ))

    return data;
};