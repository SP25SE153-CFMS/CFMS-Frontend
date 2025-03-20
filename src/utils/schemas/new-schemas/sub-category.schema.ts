import { z } from 'zod';

export const SubCategorySchema = z.object({
    subCategoryId: z.string().uuid({ message: 'ID danh mục con không hợp lệ, phải là UUID' }),
    subCategoryName: z.string().min(1, { message: 'Tên danh mục con là bắt buộc' }),
    description: z.string().optional(),
    status: z.number().int({ message: 'Trạng thái phải là số nguyên' }),
    dataType: z.string().optional(),
    categoryId: z.string().uuid({ message: 'ID danh mục không hợp lệ, phải là UUID' }),
});

export type SubCategory = z.infer<typeof SubCategorySchema>;
export const CreateSubCategorySchema = SubCategorySchema.omit({ subCategoryId: true });
