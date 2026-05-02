import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Member = sequelize.define(
  "Member",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: "full_name",
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: {
        is: /^\d{10}$/,
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    tableName: "members",
    timestamps: true,
    indexes: [
      {
        unique: true,
        name: "idx_members_email_unique",
        fields: ["email"],
      },
      {
        unique: true,
        name: "idx_members_phone_unique",
        fields: ["phone"],
      },
      {
        name: "idx_members_full_name",
        fields: ["full_name"],
      },
    ],
  }
);
