const { z } = require("zod");
const AppError = require("../utils/appError");

const updateUserSchema = z
  .object({
    id: z.string().uuid().min(1, "ID is required"),
    name: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field (name, lastName, email) must be provided",
  });

/**
 * Validate an object against a Zod schema.
 * Throws AppError(400) if validation fails.
 */
function validate(schema, data) {
  try {
    schema.parse(data);
  } catch (err) {
    // ZodError
    throw new AppError(err.errors[0].message, 400);
  }
}

module.exports = { updateUserSchema, validate };
