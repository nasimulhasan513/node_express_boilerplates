import {
  Schema, model
} from 'mongoose'

const otpSchema = new Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  otp: {
    type: String,
    required: true
  },

  created_at: {
    type: Date,
    default: Date.now
  }
})

export default model('Otp', otpSchema, 'otps')
