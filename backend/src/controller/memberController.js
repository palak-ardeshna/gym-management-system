import Joi from "joi";
import { Op, QueryTypes } from "sequelize";
import { sequelize, Member, Subscription, Attendance, Plan } from "../model/index.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notFound, conflict, badRequest } from "../utils/httpError.js";
import { getPaginationParams, getPaginatedResponse } from "../utils/pagination.js";
import { ApiError } from "../utils/apiError.js";

const toPlainMember = (member) => (member ? member.get({ plain: true }) : null);

// Validation Schemas
const memberCreateSchema = Joi.object({
  fullName: Joi.string().trim().required().messages({
    "any.required": "Full name is required",
    "string.empty": "Full name is required",
  }),
  email: Joi.string().trim().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Valid email is required",
    "string.empty": "Email is required",
  }),
  phone: Joi.string().trim().pattern(/^\d{10}$/).required().messages({
    "any.required": "Phone is required",
    "string.empty": "Phone is required",
    "string.pattern.base": "Phone must be exactly 10 digits",
  }),
  age: Joi.number().integer().min(1).allow(null, "").optional(),
  gender: Joi.string().trim().allow("", null).optional(),
  address: Joi.string().trim().allow("", null).optional(),
});

const memberUpdateSchema = Joi.object({
  fullName: Joi.string().trim(),
  email: Joi.string().trim().email(),
  phone: Joi.string().trim().pattern(/^\d{10}$/),
  age: Joi.number().integer().min(1).allow(null, ""),
  gender: Joi.string().trim().allow("", null),
  address: Joi.string().trim().allow("", null),
}).min(1);

const memberIdSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
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

export const addMember = asyncHandler(async (req, res) => {
  const validatedBody = validateSchema(memberCreateSchema, req.body);
  const { fullName, email, phone, age, gender, address } = validatedBody;

  try {
    const member = await Member.create({
      fullName,
      email,
      phone,
      age: age || null,
      gender: gender || null,
      address: address || null,
    });

    return sendSuccess(res, toPlainMember(member), "Member added successfully");
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors?.[0]?.path;
      throw conflict(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`);
    }
    throw error;
  }
});

export const editMember = asyncHandler(async (req, res) => {
  const { id } = validateSchema(memberIdSchema, req.params);
  const validatedBody = validateSchema(memberUpdateSchema, req.body);

  const member = await Member.findByPk(id);
  if (!member) throw notFound("Member");

  try {
    await member.update({
      ...validatedBody,
      age: validatedBody.age === "" ? null : validatedBody.age,
      gender: validatedBody.gender === "" ? null : validatedBody.gender,
      address: validatedBody.address === "" ? null : validatedBody.address,
    });

    return sendSuccess(res, toPlainMember(member), "Member updated successfully");
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors?.[0]?.path;
      throw conflict(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`);
    }
    throw error;
  }
});

export const removeMember = asyncHandler(async (req, res) => {
  const { id } = validateSchema(memberIdSchema, req.params);
  const member = await Member.findByPk(id);
  if (!member) throw notFound("Member");

  await member.destroy();
  return sendSuccess(res, null, "Member deleted successfully");
});

export const getMember = asyncHandler(async (req, res) => {
  const { id } = validateSchema(memberIdSchema, req.params);
  const member = await Member.findByPk(id, {
    include: [
      {
        model: Subscription,
        as: "subscriptions",
        include: [{ model: Plan, as: "plan" }],
        limit: 1,
        order: [["endDate", "DESC"], ["createdAt", "DESC"]],
      },
    ],
  });

  if (!member) throw notFound("Member");

  const plainMember = member.get({ plain: true });
  const subscription = plainMember.subscriptions?.[0] || null;

  // Add status helper
  const today = new Date().toISOString().slice(0, 10);
  let subscriptionStatus = "no_subscription";
  if (subscription) {
    if (today >= subscription.startDate && today <= subscription.endDate) {
      subscriptionStatus = "active";
    } else if (today > subscription.endDate) {
      subscriptionStatus = "expired";
    } else if (today < subscription.startDate) {
      subscriptionStatus = "upcoming";
    }
  }

  return sendSuccess(
    res,
    {
      ...plainMember,
      subscription,
      subscriptionStatus,
    },
    "Member fetched successfully"
  );
});

export const listMembers = asyncHandler(async (req, res) => {
  const { search: searchRaw } = req.query;
  const { page, limit, offset, isFetchAll, queryLimit } = getPaginationParams(req.query);

  const search = searchRaw ? `%${searchRaw.trim()}%` : null;

  const memberStatusCTE = `
    WITH latest_subs AS (
      SELECT DISTINCT ON (member_id) 
        member_id, 
        plan_id,
        plan_name, 
        end_date, 
        start_date
      FROM subscriptions
      ORDER BY member_id, end_date DESC, created_at DESC
    ),
    member_status AS (
      SELECT
        m.id AS member_id,
        COALESCE(BOOL_OR(CURRENT_DATE BETWEEN s.start_date AND s.end_date), FALSE) AS is_active,
        MAX(s.end_date) AS latest_end_date,
        (SELECT plan_name FROM latest_subs ls WHERE ls.member_id = m.id) AS last_plan_name,
        (SELECT plan_id FROM latest_subs ls WHERE ls.member_id = m.id) AS last_plan_id
      FROM members m
      LEFT JOIN subscriptions s ON s.member_id = m.id
      GROUP BY m.id
    )
  `;

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
       LEFT JOIN member_status ms ON ms.member_id = m.id
       WHERE (:search IS NULL OR m.full_name ILIKE :search OR m.email ILIKE :search OR m.phone ILIKE :search)
       ORDER BY m.id DESC
       LIMIT :limit OFFSET :offset`,
      {
        replacements: { search, limit: queryLimit || 1000000, offset: offset || 0 },
        type: QueryTypes.SELECT,
      }
    ),
    sequelize.query(
      `SELECT COUNT(*)::int AS total
       FROM members m
       WHERE (:search IS NULL OR m.full_name ILIKE :search OR m.email ILIKE :search OR m.phone ILIKE :search)`,
      {
        replacements: { search },
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

  return sendSuccess(res, response, "Members fetched successfully");
});
