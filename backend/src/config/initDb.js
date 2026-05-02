import bcrypt from "bcryptjs";
import { connectDatabase, sequelize } from "./db.js";
import { env } from "./env.js";
import { User } from "../models/userModel.js";
import { Plan } from "../models/planModel.js";
import { Member } from "../models/memberModel.js";
import { setupAssociations } from "../models/index.js";

let initPromise = null;

// Heavy setup (sync schema + seed defaults) runs in dev for convenience.
// In production it only runs when DB_FORCE_INIT=true (first deploy / migration).
const shouldRunSetup = () => env.nodeEnv !== "production" || env.dbForceInit;

export const initializeDatabase = () => {
  if (!initPromise) {
    initPromise = doInit().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
};

const doInit = async () => {
  setupAssociations();
  await connectDatabase();

  if (!shouldRunSetup()) return;

  await sequelize.sync({ alter: true });
  await ensureAdmin();
  await ensureDefaultPlans();
  await ensureSeedMembers();
};

const ensureAdmin = async () => {
  const existing = await User.findOne({ where: { email: env.adminEmail } });
  if (existing) return;

  const passwordHash = await bcrypt.hash(env.adminPassword, 10);
  await User.create({
    name: env.adminName,
    email: env.adminEmail,
    passwordHash,
    role: "admin",
  });
  console.log(`Default admin created: ${env.adminEmail}`);
};

const ensureDefaultPlans = async () => {
  const defaultPlans = [
    { name: "Monthly", price: 1000, durationInMonths: 1, description: "Basic monthly gym membership" },
    { name: "Quarterly", price: 2500, durationInMonths: 3, description: "Best for short-term goals" },
    { name: "Yearly", price: 8000, durationInMonths: 12, description: "Full year commitment for best results" },
  ];

  const existingNames = (await Plan.findAll({ attributes: ["name"] })).map((p) => p.name);
  const missing = defaultPlans.filter((p) => !existingNames.includes(p.name));
  if (missing.length === 0) return;

  await Plan.bulkCreate(missing);
  console.log(`Default plans created: ${missing.map((p) => p.name).join(", ")}`);
};

const ensureSeedMembers = async () => {
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

  const existingEmails = new Set(
    (await Member.findAll({ attributes: ["email"], where: { email: seedMembers.map((m) => m.email) } })).map((m) => m.email)
  );
  const missing = seedMembers.filter((m) => !existingEmails.has(m.email));
  if (missing.length === 0) return;

  await Member.bulkCreate(missing);
  console.log(`Seed members created: ${missing.length}`);
};
