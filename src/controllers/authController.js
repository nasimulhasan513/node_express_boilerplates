import User from '../models/User'
import CustomErrorHandler from '../services/CustomErrorHandler'
import JwtService from '../services/JwtService'
import { loginValidation, signupValidation } from '../validation/authValidation'

const authController = {
  me: async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.user._id }).select('-password -updatedAt -__v')
      if (!user) {
        return next(CustomErrorHandler.notFound())
      }
      res.json({
        message: 'User found',
        user
      })
    } catch (error) {
      return next(CustomErrorHandler.serverError(error))
    }
  },
  login: async (req, res, next) => {
    try {
      const { error } = loginValidation(req.body)
      if (error) {
        return next(error)
      }

      const { phone } = req.body

      const user = await User.findOne({ phone })
      if (!user) {
        return next(CustomErrorHandler.notFound())
      }

      // generate token
      const access_token = JwtService.sign({
        _id: user._id
      })

      res.json({
        message: 'Login Successful',
        access_token,
        user
      })
    } catch (error) {
      return next(CustomErrorHandler.serverError(error))
    }
  },
  signup: async (req, res, next) => {
    try {
      const { error } = signupValidation(req.body)
      if (error) {
        next(error)
      }
      const { name, phone } = req.body
      let user = await User.findOne({ phone }).select('-password -updatedAt -__v')

      if (!user) {
        user = await User.create({
          name,
          phone
          // other fields can be added here
        }).select('-password -updatedAt -__v')
      }

      const access_token = JwtService.sign({
        _id: user._id
      })
      res.json({
        message: 'Signup Successful',
        access_token,
        user
      })
    } catch (error) {
      return next(CustomErrorHandler.serverError(error))
    }
  },

  refresh: async (req, res, next) => {},
  forgetPassword: async (req, res, next) => {},
  resetPassword: async (req, res, next) => {},
  validateOtp: async (req, res, next) => {},

  destroy: async (req, res) => {
    try {
      const { id } = req.user._id
      const user = await User.findByIdAndDelete(id)
      if (!user) {
        return CustomErrorHandler.notFound()
      }
      res.json({
        message: 'Deleted Successfully'
      })
    } catch (error) {
      return CustomErrorHandler.serverError(error)
    }
  }
}

export default authController
