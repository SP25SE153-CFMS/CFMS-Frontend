import { categories, subCategories } from "@/utils/data/table.data";

export const getCategories = async () => {
    // Mock API call
    const data = categories.map((category) => (
        {
            ...category,
            subCategory: subCategories.filter((subCategory) => subCategory.categoryId === category.categoryId)
        }
    ))

    return data;
};