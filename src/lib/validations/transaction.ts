import { z } from "zod";

export const transactionSchema = z
  .object({
    amount: z
      .number({ required_error: "Vui lòng nhập số tiền" })
      .int("Số tiền phải là số nguyên")
      .positive("Số tiền phải lớn hơn 0")
      .max(1_000_000_000, "Số tiền quá lớn"),
    category: z.enum(["taxi", "market"], {
      required_error: "Vui lòng chọn danh mục",
    }),
    date: z.string({ required_error: "Vui lòng chọn ngày" }).refine((val) => {
      const d = new Date(val);
      return !Number.isNaN(d.getTime());
    }, "Ngày không hợp lệ"),
    payer: z
      .string({ required_error: "Vui lòng chọn người trả" })
      .trim()
      .min(1, "Vui lòng chọn người trả"),
    participants: z
      .array(z.string().trim().min(1))
      .min(1, "Cần ít nhất 1 người đi"),
    session: z.enum(["sang", "chieu"]).optional(),
    note: z.string().max(255, "Ghi chú không quá 255 ký tự").optional(),
  })
  .superRefine((data, ctx) => {
    // Taxi bắt buộc chọn buổi.
    if (data.category === "taxi" && !data.session) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["session"],
        message: "Vui lòng chọn buổi đi",
      });
    }
    // Sinh hoạt bắt buộc ghi chú nội dung.
    if (data.category === "market" && !data.note?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["note"],
        message: "Vui lòng nhập nội dung sinh hoạt",
      });
    }
  });

export type TransactionFormValues = z.infer<typeof transactionSchema>;
