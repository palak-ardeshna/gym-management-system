import Joi from "joi";
import { Op, QueryTypes } from "sequelize";
import { sequelize, Subscription, Member, Plan } from "../models/index.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notFound, badRequest } from "../utils/httpError.js";
import { getPaginationParams, getPaginatedResponse } from "../utils/pagination.js";
import { validateSchema } from "../utils/validate.js";
import { memberStatusCTE } from "../utils/memberStatusCTE.js";
import { getTodayDate } from "../utils/date.js";

const toPlainSubscription = (subscription) =>
  subscription ? subscription.get({ plain: true }) : null;

// Validation Schemas
const assignPlanSchema = Joi.object({
  memberId: Joi.number().integer().min(1).required(),
  planId: Joi.number().integer().min(1).optional(),
  planName: Joi.string().trim().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).required().messages({
    "date.min": "End date must be greater than or equal to start date",
  }),
});

const memberIdParamSchema = Joi.object({
  memberId: Joi.number().integer().min(1).required(),
});

const listStatusQuerySchema = Joi.object({
  status: Joi.string().valid("active", "expired").required(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().trim().allow("").optional(),
  all: Joi.string().valid("true", "false").optional(),
});

export const assignPlan = asyncHandler(async (req, res) => {
  const validatedBody = validateSchema(assignPlanSchema, req.body);
  const { memberId, planId, planName, startDate, endDate } = validatedBody;

  const member = await Member.findByPk(memberId);
  if (!member) throw notFound("Member");

  try {
    const subscription = await Subscription.create({ memberId, planId, planName, startDate, endDate });
    const fullSubscription = await Subscription.findByPk(subscription.id, {
      include: [{ model: Plan, as: "plan" }],
    });
    return sendSuccess(res, toPlainSubscription(fullSubscription), "Subscription assigned successfully");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      throw badRequest(error.errors?.[0]?.message || "Validation failed");
    }
    throw error;
  }
});

export const getMemberStatus = asyncHandler(async (req, res) => {
  const { memberId } = validateSchema(memberIdParamSchema, req.params);
  const member = await Member.findByPk(memberId);
  if (!member) throw notFound("Member");

  const today = getTodayDate();
  const activeSubscription = await Subscription.findOne({
    where: {
      memberId,
      startDate: { [Op.lte]: today },
      endDate: { [Op.gte]: today },
    },
    include: [{ model: Plan, as: "plan" }],
    order: [["endDate", "DESC"], ["createdAt", "DESC"]],
  });

  let status;

  if (activeSubscription) {
    status = {
      status: "active",
      subscription: toPlainSubscription(activeSubscription),
    };
  } else {
    const latestSubscription = await Subscription.findOne({
      where: { memberId },
      include: [{ model: Plan, as: "plan" }],
      order: [["endDate", "DESC"], ["createdAt", "DESC"]],
    });

    if (!latestSubscription) {
      status = {
        status: "no_subscription",
        subscription: null,
      };
    } else {
      const plainSubscription = toPlainSubscription(latestSubscription);
      status = {
        status: plainSubscription.endDate < today ? "expired" : "upcoming",
        subscription: plainSubscription,
      };
    }
  }

  return sendSuccess(
    res,
    {
      member: member.get({ plain: true }),
      ...status,
    },
    "Subscription status fetched successfully"
  );
});

export const listMembersByStatus = asyncHandler(async (req, res) => {
  const validatedQuery = validateSchema(listStatusQuerySchema, req.query);
  const { status, search: searchRaw } = validatedQuery;

  const { page, limit, offset, isFetchAll, queryLimit } = getPaginationParams(validatedQuery);
  const search = searchRaw ? `%${searchRaw.trim()}%` : null;

  const [members, totalResult] = await Promise.all([
    sequelize.query(
      `${memberStatusCTE}
       SELECT
         m.id,
         m.full_name AS "fullName",
         m.email,
         m.phone,
         m.age,
         m.gender,
         m.address,
         m.created_at AS "createdAt",
         m.updated_at AS "updatedAt",
         ms.latest_end_date AS "latestEndDate",
         ms.last_plan_name AS "planName",
         ms.last_plan_id AS "planId",
         CASE
           WHEN ms.is_active THEN 'active'
           WHEN ms.latest_end_date IS NOT NULL AND ms.latest_end_date < CURRENT_DATE THEN 'expired'
           ELSE 'no_subscription'
         END AS "subscriptionStatus"
       FROM members m
       JOIN member_status ms ON ms.member_id = m.id
       WHERE (:search IS NULL OR m.full_name ILIKE :search OR m.email ILIKE :search OR m.phone ILIKE :search)
         AND CASE
           WHEN ms.is_active THEN 'active'
           WHEN ms.latest_end_date IS NOT NULL AND ms.latest_end_date < CURRENT_DATE THEN 'expired'
           ELSE 'no_subscription'
         END = :status
       ORDER BY m.id DESC
       LIMIT :limit OFFSET :offset`,
      {
        replacements: { search, status, limit: queryLimit || 1000000, offset: offset || 0 },
        type: QueryTypes.SELECT,
      }
    ),
    sequelize.query(
      `${memberStatusCTE}
       SELECT COUNT(*)::int AS total
       FROM members m
       JOIN member_status ms ON ms.member_id = m.id
       WHERE (:search IS NULL OR m.full_name ILIKE :search OR m.email ILIKE :search OR m.phone ILIKE :search)
         AND CASE
           WHEN ms.is_active THEN 'active'
           WHEN ms.latest_end_date IS NOT NULL AND ms.latest_end_date < CURRENT_DATE THEN 'expired'
           ELSE 'no_subscription'
         END = :status`,
      {
        replacements: { search, status },
        type: QueryTypes.SELECT,
      }
    ),
  ]);

  const total = totalResult[0].total;
  const response = getPaginatedResponse({
    rows: members,
    count: total,
    limit,
    page,
    isFetchAll,
  });

  return sendSuccess(res, response, `${status} members fetched successfully`);
});
