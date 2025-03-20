import { z } from 'zod';

export const CategorySchema = z.object({
    categoryId: z.string().uuid({ message: 'ID danh mục không hợp lệ, phải là UUID' }),

    categoryType: z.number().int({ message: 'Loại danh mục phải là số nguyên' }),

    categoryCode: z.string().trim().min(1, { message: 'Mã danh mục là bắt buộc' }),

    description: z.string().trim().optional(),

    status: z.number().int({ message: 'Trạng thái phải là số nguyên' }),
});

export type Category = z.infer<typeof CategorySchema>;

export const CreateCategorySchema = CategorySchema.omit({ categoryId: true });
