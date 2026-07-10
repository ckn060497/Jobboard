import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} from "../controllers/jobController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/employer/mine", protect, authorize("employer", "admin"), getMyJobs);
router.get("/:id", getJobById);
router.post("/", protect, authorize("employer", "admin"), createJob);
router.put("/:id", protect, authorize("employer", "admin"), updateJob);
router.delete("/:id", protect, authorize("employer", "admin"), deleteJob);

export default router;
