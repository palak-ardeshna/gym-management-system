import { Plan } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

/**
 * @desc    Get all active plans
 * @route   GET /api/plans
 * @access  Private
 */

export const getAllPlans = asyncHandler(async (req, res) => {
  const plans = await Plan.findAll({
    where: { isActive: true },
    order: [["price", "ASC"]],
  });

  return sendSuccess(res, plans, "Plans fetched successfully");
});
