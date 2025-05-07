import { z } from 'zod';
import { CategoryStatus } from '../enum/status.enum';
export const CategorySchema = z.object({
    categoryId: z.string().uuid({ message: 'Danh mục không hợp lệ' }),

    categoryType: z.string().trim().min(1, { message: 'Loại danh mục là bắt buộc' }),

    categoryName: z.string().trim().min(1, { message: 'Tên danh mục là bắt buộc' }),

    description: z.string().trim().optional(),

    status: z.nativeEnum(CategoryStatus, {
        message: 'Trạng thái không hợp lệ, phải là 0 hoặc 1',
    }),
});

export type Category = z.infer<typeof CategorySchema>;

export const CreateCategorySchema = CategorySchema.omit({ categoryId: true });
