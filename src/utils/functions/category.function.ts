import { CategoryResponse } from '@/utils/types/custom.type';
import { CategoryType } from '@/utils/enum/category.enum';
import { SubCategory } from '../schemas/sub-category.schema';

/**
 * Retrieves the list of subcategories for a given category type.
 * @param categoryType - The type of the category to search within.
 * @returns An array of subcategories for the specified category type, or an empty array if not found.
 */
export function getSubCategoryByCategoryType(categoryType: CategoryType): SubCategory[] {
    const categoriesFromStorage = sessionStorage.getItem('categories');
    if (!categoriesFromStorage) return [];

    const categories = JSON.parse(categoriesFromStorage) as CategoryResponse[];
    const category = categories.find((cat) => cat.categoryType === categoryType);

    return category?.subCategories ?? [];
}
