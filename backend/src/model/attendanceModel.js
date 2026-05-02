import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Attendance = sequelize.define(
  "Attendance",
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
    checkInAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "check_in_at",
    },
    checkInDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "check_in_date",
    },
    status: {
      type: DataTypes.ENUM("present", "absent"),
      allowNull: false,
      defaultValue: "present",
      field: "status",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    tableName: "attendances",
    timestamps: false,
    indexes: [
      {
        unique: true,
        name: "unique_member_daily_checkin",
        fields: ["member_id", "check_in_date"],
      },
    ],
  }
);
