import mongoose from "mongoose"

const nodeResultSchema = new mongoose.Schema({
  nodeId: String,
  nodeType: String,
  status: { type: String, enum: ["idle", "running", "success", "error"] },
  output: mongoose.Schema.Types.Mixed,
  error: String,
  startedAt: Date,
  completedAt: Date,
  durationMs: Number
}, { _id: false })

const executionLogSchema = new mongoose.Schema(
  {
    executionId: { type: String, required: true, unique: true, index: true },
    workflowId: String,
    userId: { type: String, required: true, index: true },
    status: { type: String, enum: ["pending", "running", "completed", "failed"], default: "pending" },
    nodeResults: [nodeResultSchema],
    startedAt: Date,
    completedAt: Date,
    totalDurationMs: Number,
    trigger: { type: String, enum: ["manual", "webhook", "cron"], default: "manual" }
  },
  { timestamps: true }
)

executionLogSchema.index({ userId: 1, createdAt: -1 })

export const ExecutionLog = mongoose.model("ExecutionLog", executionLogSchema)
