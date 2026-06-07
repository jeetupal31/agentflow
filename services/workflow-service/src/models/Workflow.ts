import mongoose from "mongoose"

const workflowSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    nodes: { type: Array, default: [] },
    edges: { type: Array, default: [] },
    isActive: { type: Boolean, default: true },
    tags: [String]
  },
  { timestamps: true }
)

workflowSchema.index({ userId: 1, createdAt: -1 })

export const Workflow = mongoose.model("Workflow", workflowSchema)
