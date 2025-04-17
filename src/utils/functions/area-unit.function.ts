import { CategoryType } from '../enum/category.enum';
import { getSubCategoryByCategoryType } from './category.function';

// Define conversion factors relative to square meters
const AREA_UNIT_CONVERSIONS: Record<string, number> = {
    SQUARE_METER: 1,
    SQUARE_KILOMETER: 1_000_000,
    HECTARE: 10_000,
    SQUARE_FOOT: 0.092903,
    SQUARE_YARD: 0.836127,
    ACRE: 4046.86,
    ha: 10_000,
    'm²': 1,
};

export function convertArea(value: number, fromUnitId: string, toUnitId: string): number {
    // Get the unit names from the IDs
    const fromUnit = getSubCategoryByCategoryType(CategoryType.AREA_UNIT)?.find(
        (unit) => unit.subCategoryId === fromUnitId,
    )?.subCategoryName;

    const toUnit = getSubCategoryByCategoryType(CategoryType.AREA_UNIT)?.find(
        (unit) => unit.subCategoryId === toUnitId,
    )?.subCategoryName;

    if (!fromUnit || !toUnit) {
        console.warn('Invalid area unit IDs provided');
        return value;
    }

    // Convert to square meters first
    const valueInSquareMeters = value * (AREA_UNIT_CONVERSIONS[fromUnit] || 1);

    // Then convert to target unit
    return valueInSquareMeters / (AREA_UNIT_CONVERSIONS[toUnit] || 1);
}
