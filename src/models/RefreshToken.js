import { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    token: { type: String, unique: true },
  },
  { timestamps: false }
);

export default model(
  "refreshToken",
  refreshTokenSchema,
  "refreshTokens"

);
