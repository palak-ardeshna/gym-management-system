import Joi from "joi";
import bcrypt from "bcryptjs";
import { User } from "../model/index.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { unauthorized } from "../utils/httpError.js";
import { generateToken } from "../utils/jwt.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

// Validation Schemas
const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Valid email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

const validateSchema = (schema, value) => {
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

export const login = asyncHandler(async (req, res) => {
  const { email, password } = validateSchema(loginSchema, req.body);
  
  const user = await User.unscoped().findOne({
    where: { email },
  });

  if (!user) {
    throw unauthorized("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw unauthorized("Invalid email or password");
  }

  const token = generateToken({ id: user.id, email: user.email, name: user.name, role: user.role });

  return sendSuccess(
    res,
    {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    "Login successful"
  );
});
