import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDatabase } from "../config/db.js";
import { User } from "../models/User.js";

const seedAdmin = async () => {
  await connectDatabase();

  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (existingAdmin) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123", 10);

  await User.create({
    name: process.env.ADMIN_NAME || "System Admin",
    email: process.env.ADMIN_EMAIL || "admin@library.local",
    password,
    role: "admin",
    status: "approved"
  });

  console.log("Admin created");
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
