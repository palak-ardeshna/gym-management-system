import { sequelize } from "../config/db.js";
import { Member } from "./memberModel.js";
import { Attendance } from "./attendanceModel.js";
import { Subscription } from "./subscriptionModel.js";
import { User } from "./userModel.js";
import { Plan } from "./planModel.js";

let associationsReady = false;

export const setupAssociations = () => {
  if (associationsReady) {
    return;
  }

  // Plan and Subscription Relation
  Plan.hasMany(Subscription, {
    foreignKey: "planId",
    as: "subscriptions",
  });

  Subscription.belongsTo(Plan, {
    foreignKey: "planId",
    as: "plan",
  });

  Member.hasMany(Attendance, {
    foreignKey: "memberId",
    as: "attendances",
    onDelete: "CASCADE",
    hooks: true,
  });

  Attendance.belongsTo(Member, {
    foreignKey: "memberId",
    as: "member",
  });

  Member.hasMany(Subscription, {
    foreignKey: "memberId",
    as: "subscriptions",
    onDelete: "CASCADE",
    hooks: true,
  });

  Subscription.belongsTo(Member, {
    foreignKey: "memberId",
    as: "member",
  });

  associationsReady = true;
};

export { sequelize, Member, Attendance, Subscription, User, Plan };
