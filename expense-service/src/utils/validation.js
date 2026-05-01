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

const recurringSchema = z.object({
  frequency: z.enum(["daily", "weekly", "monthly"], {
    errorMap: () => ({ message: "frequency must be one of: daily, weekly, monthly" }),
  }),
});

const budgetSchema = z.object({
  amount: z.number().positive(),
  categoryId: z.string().uuid(),
  period: z.enum(["monthly", "yearly"]),
  startDate: z.string().date(), // YYYY-MM-DD — avoids timezone shift issues
});

// Category is immutable after creation — updates only allow amount, period, startDate
const updateBudgetSchema = z.object({
  amount: z.number().positive(),
  period: z.enum(["monthly", "yearly"]),
  startDate: z.string().date(), // YYYY-MM-DD — avoids timezone shift issues
});

module.exports = {
  transactionSchema,
  categorySchema,
  recurringSchema,
  budgetSchema,
  updateBudgetSchema,
};
