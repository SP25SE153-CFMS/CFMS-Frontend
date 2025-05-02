import { z } from 'zod';

export const SignInRequestSchema = z
    .object({
        mail: z
            .string()
            .trim()
            .min(1, { message: 'Email là bắt buộc' })
            .max(255, { message: 'Email không được vượt quá 255 ký tự' })
            .email({ message: 'Email không hợp lệ' })
            .toLowerCase(),
        password: z.string().trim(),
        // TODO: Remove this code
        // .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
        // .max(100, { message: 'Mật khẩu không được vượt quá 100 ký tự' })
        // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        //     message:
        //         'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt',
        // }),
    })
    .strict();

export const SignUpRequestSchema = z
    .object({
        fullname: z
            .string()
            .trim()
            .min(2, { message: 'Tên phải có ít nhất 2 ký tự' })
            .max(100, { message: 'Tên không được vượt quá 100 ký tự' })
            .regex(/^[A-Za-zÀ-ỹ\s'-]+$/, { message: 'Tên chỉ được chứa chữ cái và dấu' }),
        phoneNumber: z
            .string()
            .trim()
            .regex(
                /^(\+84|0)(3|5|7|8|9)\d{8}$/,
                'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại hợp lệ.',
            ),

        mail: z
            .string()
            .trim()
            .min(1, { message: 'Email là bắt buộc' })
            .max(255, { message: 'Email không được vượt quá 255 ký tự' })
            .email({ message: 'Email không hợp lệ' })
            .toLowerCase(),
        password: z
            .string()
            .trim()
            .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
            .max(100, { message: 'Mật khẩu không được vượt quá 100 ký tự' }),
        // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        //     message:
        //         'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt',
        // }),
    })
    .strict();

export type SignInRequest = z.infer<typeof SignInRequestSchema>;
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
