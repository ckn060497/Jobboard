import express from "express";
import {
  getStats,
  getAllUsers,
  toggleUserStatus,
  getAllJobsAdmin,
  toggleJobApproval,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.put("/users/:id/status", toggleUserStatus);
router.get("/jobs", getAllJobsAdmin);
router.put("/jobs/:id/approve", toggleJobApproval);

export default router;
