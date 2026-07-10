// Run with: node seed/createAdmin.js
// Creates (or resets the password of) an admin account using env vars or defaults below.
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@jobboard.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";
const ADMIN_NAME = process.env.ADMIN_NAME || "Site Admin";

const run = async () => {
  await connectDB();

  let admin = await User.findOne({ email: ADMIN_EMAIL }).select("+password");
  if (admin) {
    admin.password = ADMIN_PASSWORD;
    admin.role = "admin";
    await admin.save();
    console.log(`Existing admin updated: ${ADMIN_EMAIL}`);
  } else {
    admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });
    console.log(`Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }

  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
