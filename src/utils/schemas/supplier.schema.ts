import { z } from 'zod';

export const SupplierSchema = z.object({
    supplierId: z.string().uuid({ message: 'ID nhà cung cấp không hợp lệ, phải là UUID' }),
    supplierName: z.string().min(1, { message: 'Tên nhà cung cấp là bắt buộc' }).trim(),
    supplierCode: z.string().min(1, { message: 'Mã nhà cung cấp là bắt buộc' }),
    address: z.string().min(1, { message: 'Điền địa chỉ nhà cung cấp' }).trim(),
    phoneNumber: z
        .string()
        .regex(/^[0-9]{10-11}$/, { message: 'Điền số điện thoại' })
        .trim(),
    bankAccount: z.string(),
    status: z.number().int().default(1),
});

export const CreateSupplierSchema = SupplierSchema.omit({ supplierId: true });

export type Supplier = z.infer<typeof SupplierSchema>;
export type CreateSupplier = z.infer<typeof CreateSupplierSchema>;
