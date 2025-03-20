import { z } from 'zod';

export const CategorySchema = z.object({
    categoryId: z.string().uuid({ message: 'ID danh mục không hợp lệ, phải là UUID' }),

    // categoryType: z.number().int({ message: 'Loại danh mục phải là số nguyên' }),
    categoryType: z.string().trim().min(1, { message: 'Loại danh mục là bắt buộc' }),

    categoryCode: z.string().trim().min(1, { message: 'Mã danh mục là bắt buộc' }),

    description: z.string().trim().optional(),

    status: z
        .enum(['0', '1'], {
            message: 'Trạng thái không hợp lệ, phải là 0 hoặc 1',
        })
        .transform((value) => parseInt(value, 10)),
});

export type Category = z.infer<typeof CategorySchema>;

export const CreateCategorySchema = CategorySchema.omit({ categoryId: true });
