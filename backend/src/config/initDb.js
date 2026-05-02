import bcrypt from "bcryptjs";
import { connectDatabase, sequelize } from "./db.js";
import { env } from "./env.js";
import { User } from "../model/userModel.js";
import { Plan } from "../model/planModel.js";
import { Member } from "../model/memberModel.js";
import { setupAssociations } from "../model/index.js";

let isInitialized = false;

export const initializeDatabase = async () => {
  if (isInitialized) {
    return;
  }

  setupAssociations();
  await connectDatabase();
  await sequelize.sync({ alter: true });

  // Create default admin
  const existingAdmin = await User.scope("withPassword").findOne({
    where: { email: env.adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(env.adminPassword, 10);

    await User.create({
      name: env.adminName,
      email: env.adminEmail,
      passwordHash,
      role: "admin",
    });

    console.log(`Default admin created with email: ${env.adminEmail}`);
  }

  // Create default plans
  const defaultPlans = [
    {
      name: "Monthly",
      price: 1000,
      durationInMonths: 1,
      description: "Basic monthly gym membership",
    },
    {
      name: "Quarterly",
      price: 2500,
      durationInMonths: 3,
      description: "Best for short-term goals",
    },
    {
      name: "Yearly",
      price: 8000,
      durationInMonths: 12,
      description: "Full year commitment for best results",
    },
  ];

  for (const planData of defaultPlans) {
    const [plan, created] = await Plan.findOrCreate({
      where: { name: planData.name },
      defaults: planData,
    });

    if (created) {
      console.log(`Default plan created: ${planData.name}`);
    }
  }

  // Create seed members
  const seedMembers = [
    { fullName: "Rajesh Patel", email: "rajesh@example.com", phone: "9876543210", age: 25, gender: "male", address: "Ahmedabad" },
    { fullName: "Sneha Sharma", email: "sneha@example.com", phone: "9876543211", age: 22, gender: "female", address: "Surat" },
    { fullName: "Amit Shah", email: "amit@example.com", phone: "9876543212", age: 30, gender: "male", address: "Baroda" },
    { fullName: "Priya Mehta", email: "priya@example.com", phone: "9876543213", age: 28, gender: "female", address: "Rajkot" },
    { fullName: "Vikram Rathod", email: "vikram@example.com", phone: "9876543214", age: 35, gender: "male", address: "Bhavnagar" },
    { fullName: "Anjali Gupta", email: "anjali@example.com", phone: "9876543215", age: 24, gender: "female", address: "Jamnagar" },
    { fullName: "Suresh Raina", email: "suresh@example.com", phone: "9876543216", age: 32, gender: "male", address: "Gandhinagar" },
    { fullName: "Kavita Singh", email: "kavita@example.com", phone: "9876543217", age: 27, gender: "female", address: "Anand" },
    { fullName: "Manoj Tiwari", email: "manoj@example.com", phone: "9876543218", age: 40, gender: "male", address: "Vapi" },
    { fullName: "Riya Kapoor", email: "riya@example.com", phone: "9876543219", age: 21, gender: "female", address: "Navsari" },
    { fullName: "Hardik Pandya", email: "hardik@example.com", phone: "9876543220", age: 29, gender: "male", address: "Ahmedabad" },
    { fullName: "Deepika Padukone", email: "deepika@example.com", phone: "9876543221", age: 33, gender: "female", address: "Surat" },
    { fullName: "Rahul Dravid", email: "rahul@example.com", phone: "9876543222", age: 45, gender: "male", address: "Baroda" },
    { fullName: "Sunita Williams", email: "sunita@example.com", phone: "9876543223", age: 38, gender: "female", address: "Rajkot" },
    { fullName: "Rohit Sharma", email: "rohit@example.com", phone: "9876543224", age: 34, gender: "male", address: "Bhavnagar" },
    { fullName: "Nehal Chudasama", email: "nehal@example.com", phone: "9876543225", age: 26, gender: "female", address: "Jamnagar" },
    { fullName: "Mahendra Singh", email: "mahendra@example.com", phone: "9876543226", age: 42, gender: "male", address: "Gandhinagar" },
    { fullName: "Pooja Hegde", email: "pooja@example.com", phone: "9876543227", age: 29, gender: "female", address: "Anand" },
    { fullName: "Jasprit Bumrah", email: "jasprit@example.com", phone: "9876543228", age: 28, gender: "male", address: "Vapi" },
    { fullName: "Smriti Mandhana", email: "smriti@example.com", phone: "9876543229", age: 25, gender: "female", address: "Navsari" },
  ];

  for (const memberData of seedMembers) {
    await Member.findOrCreate({
      where: { email: memberData.email },
      defaults: memberData,
    });
  }
  console.log("Seed members check/creation completed");

  isInitialized = true;
};
