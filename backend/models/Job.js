import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: {
      name: { type: String, required: true },
      logoUrl: { type: String, default: "" },
    },
    location: { type: String, required: true },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
      default: "full-time",
    },
    category: { type: String, default: "General" },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "lead"],
      default: "entry",
    },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    skills: [{ type: String }],
    status: { type: String, enum: ["open", "closed"], default: "open" },
    applicationsCount: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true }, // admin can moderate
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", skills: "text", "company.name": "text" });

export default mongoose.model("Job", jobSchema);
