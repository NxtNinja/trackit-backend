const { z } = require("zod");

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive(),
  categoryId: z.string().uuid(),
  description: z.string().optional(),
  date: z.string().datetime(),
});

const categorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(["income", "expense"]),
});

module.exports = {
  transactionSchema,
  categorySchema,
};
