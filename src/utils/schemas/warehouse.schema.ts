import { z } from 'zod';

export const WarehouseSchema = z.object({
    wareId: z.string().uuid({ message: 'ID kho không hợp lệ, phải là UUID' }),
    farmId: z.string().uuid({ message: 'ID trang trại không hợp lệ, phải là UUID' }),
    storageTypeId: z.string().uuid({ message: 'ID loại lưu trữ không hợp lệ, phải là UUID' }),
    warehouseName: z.string().min(1, { message: 'Tên kho là bắt buộc' }),
    maxCapacity: z.number().positive({ message: 'Dung tích tối đa phải là số dương' }),
    currentCapacity: z.number().nonnegative({ message: 'Dung tích hiện tại không được âm' }),
    description: z.string().optional(),
    status: z.number().int({ message: 'Trạng thái phải là số nguyên' }),
});

export type Warehouse = z.infer<typeof WarehouseSchema>;
export const CreateWarehouseSchema = WarehouseSchema.omit({ wareId: true });
