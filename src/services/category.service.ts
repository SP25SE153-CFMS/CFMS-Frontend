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

export const createCategory = async (category: Category): Promise<Category> => {
    // Mock API call
    categories.push(category);
    return category;
};

export const updateCategory = async (category: Category): Promise<Category> => {
    // Mock API call
    const index = categories.findIndex((item) => item.categoryId === category.categoryId);
    categories[index] = category;
    return category;
};

export const deleteCategory = async (id: string): Promise<string> => {
    // Mock API call
    const index = categories.findIndex((item) => item.categoryId === id);
    categories.splice(index, 1);
    return id;
};