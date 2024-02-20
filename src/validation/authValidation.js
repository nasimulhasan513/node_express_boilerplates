import Joi from 'joi'

const signupValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    class: Joi.string().min(3).required(),
    institute: Joi.string().min(3).required(),
    phone: Joi.string().min(10).required(),
    password: Joi.string().min(6).required(),
    nid: Joi.string().required(),
    address: Joi.string().required(),
    reference: Joi.string().allow('').allow(null),
    fcm_token: Joi.string().allow('').allow(null)
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

const forgetPasswordValidation = (data) => {
  const schema = Joi.object({
    phone: Joi.string().min(10).max(12).required(),
    password: Joi.string(),
    repeat_password: Joi.ref('password')
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

const refreshTokenValidation = (data) => {
  const refreshValidation = Joi.object({
    refresh_token: Joi.string().required(),
    fcm_token: Joi.string()
  })

  return refreshValidation.validate(data)
}

export { loginValidation, roleValidation, signupValidation, forgetPasswordValidation, refreshTokenValidation }
