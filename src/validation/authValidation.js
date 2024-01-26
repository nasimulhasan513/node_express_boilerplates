import Joi from 'joi'

const signupValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).email(),
    phone: Joi.string().min(10).required(),
    password: Joi.string().min(6).required()
  })
  return schema.validate(data)
}

const loginValidation = (data) => {
  const schema = Joi.object({
    phone: Joi.string().min(10).required(),
    password: Joi.string().min(6).required()
  })
  return schema.validate(data)
}

const roleValidation = (data) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    role: Joi.string().required()
  })
  return schema.validate(data)
}

export { loginValidation, roleValidation, signupValidation }
