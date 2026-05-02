import { QueryTypes } from "sequelize";
import { sequelize, Member, Attendance } from "../models/index.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const memberStatusCTE = `
    WITH member_status AS (
      SELECT
        m.id AS member_id,
        COALESCE(BOOL_OR(CURRENT_DATE BETWEEN s.start_date AND s.end_date), FALSE) AS is_active,
        MAX(s.end_date) AS latest_end_date
      FROM members m
      LEFT JOIN subscriptions s ON s.member_id = m.id
      GROUP BY m.id
    )
  `;

  const [totalMembers, subscriptionCounts, recentActivities] = await Promise.all([
    Member.count(),
    sequelize.query(
      `${memberStatusCTE}
       SELECT
         COUNT(*) FILTER (WHERE ms.is_active)::int AS "activeMembers",
         COUNT(*) FILTER (
           WHERE NOT ms.is_active
             AND ms.latest_end_date IS NOT NULL
             AND ms.latest_end_date < CURRENT_DATE
         )::int AS "expiredMembers"
       FROM member_status ms`,
      {
        type: QueryTypes.SELECT,
      }
    ),
    // Fetch recent attendance activities
    Attendance.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Member,
          as: "member",
          attributes: ["fullName"],
        },
      ],
    }),
  ]);

  const stats = subscriptionCounts[0];

  // Map activities to a cleaner format
  const activities = recentActivities.map((activity) => ({
    id: activity.id,
    memberName: activity.member?.fullName || "Unknown",
    status: activity.status,
    date: activity.checkInDate,
    createdAt: activity.createdAt,
    type: "attendance",
  }));

  return sendSuccess(
    res,
    {
      totalMembers,
      activeMembers: stats.activeMembers,
      expiredMembers: stats.expiredMembers,
      recentActivities: activities,
    },
    "Dashboard stats fetched successfully"
  );
});
