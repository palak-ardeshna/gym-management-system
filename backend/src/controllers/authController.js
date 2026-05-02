import Joi from "joi";
import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { unauthorized } from "../utils/httpError.js";
import { generateToken } from "../utils/jwt.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateSchema } from "../utils/validate.js";

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

export const login = asyncHandler(async (req, res) => {
  const { email, password } = validateSchema(loginSchema, req.body);
  
  const user = await User.scope("withPassword").findOne({
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
