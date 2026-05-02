import { ApiError } from "./apiError.js";

export const validateSchema = (schema, value) => {
  const { error, value: validatedValue } = schema.validate(value, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    throw new ApiError(
      400,
      error.details[0]?.message || "Validation failed",
      error.details.map((detail) => ({
        message: detail.message,
        path: detail.path,
      }))
    );
  }

  return validatedValue;
};
