import { CategoryResponse } from '@/utils/types/custom.type';
import { CategoryType } from '@/utils/enum/category.enum';
import { SubCategory } from '../schemas/sub-category.schema';

/**
 * Retrieves the list of subcategories for a given category type.
 * @param categoryType - The type of the category to search within.
 * @returns An array of subcategories for the specified category type, or an empty array if not found.
 */
export function getSubCategoryByCategoryType(categoryType: CategoryType): SubCategory[] {
    if (typeof window === 'undefined') return [];

    const categoriesFromStorage = sessionStorage.getItem('categories');
    if (!categoriesFromStorage) return [];

    const categories = JSON.parse(categoriesFromStorage) as CategoryResponse[];
    const category = categories.find((cat) => cat.categoryType === categoryType);

    return category?.subCategories ?? [];
}

export function getChickenType(chickenTypeId: string): string {
    const categories = getSubCategoryByCategoryType(CategoryType.CHICKEN);
    const chickenType = categories.find((cat) => cat.subCategoryId === chickenTypeId);
    return chickenType?.subCategoryName ?? 'Không có';
}

export function getPurpose(purposeId: string): string {
    const categories = getSubCategoryByCategoryType(CategoryType.PURPOSE);
    const purpose = categories.find((cat) => cat.subCategoryId === purposeId);
    return purpose?.subCategoryName ?? 'Không có';
}

export function getWeightUnit(weightUnitId: string): string {
    const categories = getSubCategoryByCategoryType(CategoryType.WEIGHT_UNIT);
    const weightUnit = categories.find((cat) => cat.subCategoryId === weightUnitId);
    return weightUnit?.subCategoryName ?? '';
}

export function getDensityUnit(densityUnitId: string): string {
    const categories = getSubCategoryByCategoryType(CategoryType.DENSITY_UNIT);
    const densityUnit = categories.find((cat) => cat.subCategoryId === densityUnitId);
    return densityUnit?.subCategoryName ?? '';
}

export function getAreaUnit(areaUnitId: string): string {
    const categories = getSubCategoryByCategoryType(CategoryType.AREA_UNIT);
    const areaUnit = categories.find((cat) => cat.subCategoryId === areaUnitId);
    return areaUnit?.subCategoryName ?? '';
}

export function getLengthUnit(lengthUnitId: string): string {
    const categories = getSubCategoryByCategoryType(CategoryType.LENGTH_UNIT);
    const sizeUnit = categories.find((cat) => cat.subCategoryId === lengthUnitId);
    return sizeUnit?.subCategoryName ?? '';
}

export function getMaterial(materialId: string): string {
    const categories = getSubCategoryByCategoryType(CategoryType.MATERIAL);
    const material = categories.find((cat) => cat.subCategoryId === materialId);
    return material?.subCategoryName ?? '';
}

export function getTaskType(taskTypeId: string): string {
    const categories = getSubCategoryByCategoryType(CategoryType.TASK_TYPE);
    const taskType = categories.find((cat) => cat.subCategoryId === taskTypeId);
    return taskType?.description ?? '';
}

export function getQuantityUnit(quantityUnitId: string): string {
    const categories = getSubCategoryByCategoryType(CategoryType.QUANTITY_UNIT);
    const quantityUnit = categories.find((cat) => cat.subCategoryId === quantityUnitId);
    return quantityUnit?.subCategoryName ?? '';
}

export function getRequestType(requestTypeId: string): string {
    const categories = getSubCategoryByCategoryType(CategoryType.REQUEST_TYPE);
    const requestType = categories.find((cat) => cat.subCategoryId === requestTypeId);
    return requestType?.subCategoryName ?? '';
}

export function getReceiptType(receiptTypeId: string): string {
    const categories = getSubCategoryByCategoryType(CategoryType.RECEIPT_TYPE);
    const receiptType = categories.find((cat) => cat.subCategoryId === receiptTypeId);
    return receiptType?.subCategoryName ?? '';
}
