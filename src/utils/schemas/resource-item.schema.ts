import { z } from 'zod';

// Schema cơ bản cho tất cả resource
export const BaseResourceSchema = z.object({
    resourceType: z.string(),
    unitSpecification: z.string(),
    description: z.string().optional(),
    price: z.number().optional(),
    productionDate: z.string().optional(),
    expiryDate: z.string().optional(),
    purchaseDate: z.string().optional(),
});

// Schema cho thức ăn
export const FoodResourceSchema = BaseResourceSchema.extend({
    foodCode: z.string(),
    foodName: z.string(),
    note: z.string().optional(),
});

// Schema cho thuốc
export const MedicineResourceSchema = BaseResourceSchema.extend({
    medicineCode: z.string(),
    medicineName: z.string(),
    usage: z.string(),
    dosageForm: z.string().optional(),
    storageCondition: z.string().optional(),
    disease: z.string().optional(),
});

// Schema cho thiết bị
export const EquipmentResourceSchema = BaseResourceSchema.extend({
    equipmentCode: z.string(),
    equipmentName: z.string(),
    material: z.string(),
    warranty: z.number().optional(),
    size: z.number().optional(),
    weight: z.number().optional(),
});

// Kiểu TypeScript
export type BaseResource = z.infer<typeof BaseResourceSchema>;
export type FoodResource = z.infer<typeof FoodResourceSchema>;
export type MedicineResource = z.infer<typeof MedicineResourceSchema>;
export type EquipmentResource = z.infer<typeof EquipmentResourceSchema>;

// Resource tổng hợp (union type)
export type ResourceItem = FoodResource | MedicineResource | EquipmentResource;