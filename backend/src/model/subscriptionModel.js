import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Subscription = sequelize.define(
  "Subscription",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "member_id",
      references: {
        model: "members",
        key: "id",
      },
    },
    planId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "plan_id",
      references: {
        model: "plans",
        key: "id",
      },
    },
    planName: {
      type: DataTypes.STRING(80),
      allowNull: false,
      field: "plan_name",
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "end_date",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    tableName: "subscriptions",
    timestamps: false,
    indexes: [
      {
        name: "idx_subscriptions_member_id",
        fields: ["member_id"],
      },
      {
        name: "idx_subscriptions_member_end_created",
        fields: ["member_id", "end_date", "created_at"],
      },
      {
        name: "idx_subscriptions_member_start_end",
        fields: ["member_id", "start_date", "end_date"],
      },
    ],
    validate: {
      validSubscriptionDates() {
        if (new Date(this.endDate) < new Date(this.startDate)) {
          throw new Error("End date must be greater than or equal to start date");
        }
      },
    },
  }
);
