import Joi from "joi";
import { Op } from "sequelize";
import { Attendance, Member } from "../model/index.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notFound, conflict } from "../utils/httpError.js";
import { ApiError } from "../utils/apiError.js";

const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const toPlainAttendance = (attendance) => (attendance ? attendance.get({ plain: true }) : null);

// Validation Schemas
const checkInSchema = Joi.object({
  memberId: Joi.number().integer().min(1).required(),
  status: Joi.string().valid("present", "absent").optional(),
  date: Joi.date().iso().optional(),
});

const reportQuerySchema = Joi.object({
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(2000).max(2100).required(),
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

export const checkInMember = asyncHandler(async (req, res) => {
  const { memberId, status = "present", date } = validateSchema(checkInSchema, req.body);
  const targetDate = date ? date.toISOString().slice(0, 10) : getTodayDate();
  
  const member = await Member.findByPk(memberId);
  if (!member) {
    throw notFound("Member");
  }

  // Check if attendance already exists for this date
  const existingAttendance = await Attendance.findOne({
    where: {
      memberId,
      checkInDate: targetDate,
    },
  });

  if (existingAttendance) {
    // If status is same, return informative message instead of updating
    if (existingAttendance.status === status) {
      return sendSuccess(
        res, 
        toPlainAttendance(existingAttendance), 
        `Attendance already marked as ${status} for ${targetDate}`
      );
    }
    
    // If status is different, update it (correction)
    await existingAttendance.update({ status });
    return sendSuccess(
      res, 
      toPlainAttendance(existingAttendance), 
      `Attendance updated to ${status} for ${targetDate}`
    );
  }

  // Create new attendance record
  const attendance = await Attendance.create({
    memberId,
    checkInDate: targetDate,
    status,
  });

  return sendSuccess(res, toPlainAttendance(attendance), `Attendance marked as ${status} for ${targetDate}`);
});

export const markAbsent = asyncHandler(async (req, res) => {
  const { memberId } = validateSchema(checkInSchema, req.body);

  const member = await Member.findByPk(memberId);
  if (!member) {
    throw notFound("Member");
  }

  const attendance = await Attendance.findOne({
    where: {
      memberId,
      checkInDate: getTodayDate(),
    },
  });

  if (attendance) {
    await attendance.destroy();
  }

  return sendSuccess(res, null, "Member marked as absent");
});

export const getAttendanceReport = asyncHandler(async (req, res) => {
  const { month, year } = validateSchema(reportQuerySchema, req.query);

  // Use string formatting to avoid timezone shifts
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const attendances = await Attendance.findAll({
    where: {
      checkInDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    attributes: ["memberId", "checkInDate", "status"],
  });

  return sendSuccess(res, attendances, "Attendance report fetched successfully");
});
