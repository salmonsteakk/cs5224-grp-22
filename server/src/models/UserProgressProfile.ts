import _dynamoose from "dynamoose";
const dynamoose = (_dynamoose as any).default ?? _dynamoose;

const profileSchema = new dynamoose.Schema({
  userId: {
    type: String,
    hashKey: true,
  },
  totalPoints: { type: Number, required: true, default: 0 },
  level: { type: Number, required: true, default: 1 },
  achievements: {
    type: Array,
    schema: [String],
    default: [],
  },
  updatedAt: { type: String, required: true },
});

export const UserProgressProfileModel = dynamoose.model("UserProgressProfile", profileSchema, {
  tableName: "UserProgressProfile",
  create: false,
  waitForActive: false,
});
