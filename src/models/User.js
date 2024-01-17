import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    min: 10,
    max: 12,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },

  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
});

userSchema.plugin(mongoosePaginate);

export default model("User", userSchema);
