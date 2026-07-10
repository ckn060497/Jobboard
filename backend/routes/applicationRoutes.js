import express from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/:jobId",
  protect,
  authorize("jobseeker"),
  upload.single("resume"),
  applyToJob
);
router.get("/mine", protect, authorize("jobseeker"), getMyApplications);
router.get("/job/:jobId", protect, authorize("employer", "admin"), getApplicantsForJob);
router.put("/:id/status", protect, authorize("employer", "admin"), updateApplicationStatus);

export default router;
