import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 255
  },
  class: {
    type: String,
    required: true,
    min: 3,
    max: 255
  },
  institute: {
    type: String,
    required: true,
    min: 3,
    max: 255
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    min: 10,
    max: 12
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  nid: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  reference: {
    type: String
  },
  fcm_tokens: {
    type: [String]
  }

})

userSchema.plugin(mongoosePaginate)

export default model('User', userSchema)
