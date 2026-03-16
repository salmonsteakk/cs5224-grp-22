import * as dynamoose from "dynamoose";

const userSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
  },
  email: {
    type: String,
    required: true,
    index: {
      name: "emailIndex",
      type: "global",
    },
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["student"],
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "disabled"],
  },
});

export const UserModel = dynamoose.model("User", userSchema, {
  tableName: "Users",
  create: false,
  waitForActive: false,
});