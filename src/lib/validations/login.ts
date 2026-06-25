import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Vui lòng nhập email" })
    .min(1, "Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: z
    .string({ required_error: "Vui lòng nhập mật khẩu" })
    .min(1, "Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
