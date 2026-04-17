import _dynamoose from "dynamoose";
const dynamoose = (_dynamoose as any).default ?? _dynamoose;

const auditEventSchema = new dynamoose.Schema({
  at: { type: String, required: true },
  actorId: { type: String, required: false },
  action: {
    type: String,
    required: true,
    enum: ["created", "triaged", "corrected", "suppressed", "closed", "note"],
  },
  fromStatus: { type: String, required: false },
  toStatus: { type: String, required: false },
  note: { type: String, required: false },
});

const correctionSchema = new dynamoose.Schema({
  correctedAt: { type: String, required: true },
  correctedBy: { type: String, required: false },
  notice: { type: String, required: true },
  reason: { type: String, required: true },
});

const aiReportSchema = new dynamoose.Schema({
  reportId: {
    type: String,
    hashKey: true,
  },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  source: {
    type: String,
    required: true,
    enum: ["chat", "dashboard-coach"],
    index: {
      name: "SourceCreatedAtIndex",
      type: "global",
      rangeKey: "createdAt",
    },
  },
  status: {
    type: String,
    required: true,
    enum: ["new", "triaged", "corrected", "suppressed", "closed"],
    index: {
      name: "StatusUpdatedAtIndex",
      type: "global",
      rangeKey: "updatedAt",
    },
  },
  priority: {
    type: String,
    required: true,
    enum: ["critical", "high", "medium", "low"],
  },
  outputExcerpt: { type: String, required: true },
  outputHash: { type: String, required: false },
  reportReason: { type: String, required: true },
  endpoint: { type: String, required: false },
  policyDecision: { type: String, required: false },
  policyReason: { type: String, required: false },
  policyConfidence: { type: Number, required: false },
  policyRequestId: { type: String, required: false },
  reporterUserId: { type: String, required: false },
  reporterName: { type: String, required: false },
  pathname: { type: String, required: false },
  metadataJson: { type: String, required: false },
  correction: { type: Object, schema: correctionSchema, required: false },
  auditTrail: {
    type: Array,
    schema: [auditEventSchema],
    required: true,
    default: [],
  },
});

export const AiReportModel = dynamoose.model("AiReport", aiReportSchema, {
  tableName: "AiReports",
  create: false,
  waitForActive: false,
});
