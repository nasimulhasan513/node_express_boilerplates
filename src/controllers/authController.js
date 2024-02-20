import User from '../models/User'
import CustomErrorHandler from '../services/CustomErrorHandler'
import JwtService from '../services/JwtService'
import bcrypt from 'bcrypt'
import { forgetPasswordValidation, loginValidation, refreshTokenValidation, signupValidation } from '../validation/authValidation'
import Otp from '../models/otp'
import axios from 'axios'
import RefreshToken from '../models/RefreshToken'

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
      const { phone } = req.body
      let user = await User.findOne({ phone }).select('-password -updatedAt -__v')

      if (!user) {
        const userData = req.body

        userData.password = await bcrypt.hash(userData.password, 10)
        userData.fcm_tokens = [userData.fcm_token]
        delete userData.fcm_token
        user = await User.create(userData).select('-password -updatedAt -__v')
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
  async otp (req, res, next) {
    const otp = Math.floor(100000 + Math.random() * 900000)
    const user = {
      phone: req.body.phone,
      otp
    }

    try {
      if (req.body.phone.startsWith('015')) {
        await axios.get(
          `http://bulksmsbd.net/api/smsapi?api_key=pgKi3yacWCobsIVyAUBD&type=text&number=${req.body.phone}&senderid=8809617612509&message=Your OTP is ${otp}`
        )
      } else {
        await axios.post(
          'https://easysms.xyz/api/sms',
          {
            phone: req.body.phone,
            body: `Your OTP is ${otp}`
          },
          {
            headers: {
              Authorization: 'Bearer 57|a91oVzpH8lVYjcHzUrMnUMmFn0OIK8NUAOjEphT8'
            }
          }
        )
      }

      const existing = await Otp.exists({
        phone: req.body.phone
      })
      let otpInstance
      if (existing) {
        otpInstance = await Otp.findOneAndUpdate(
          {
            phone: req.body.phone
          },
          user,
          {
            new: true
          }
        )
      } else {
        otpInstance = await Otp.create(user)
      }

      res.status(200).json({
        status: 200,
        message: 'OTP sent successfully',
        ...otpInstance.toObject()
      })
    } catch (err) {
      return next(err)
    }
  },
  refresh: async (req, res, next) => {
    const { error } = refreshTokenValidation(req.body)

    if (error) {
      return next(error)
    }

    const { refresh_token, fcm_token } = req.body

    let refreshToken
    try {
      refreshToken = await RefreshToken.findOne({
        token: refresh_token
      })

      if (!refreshToken) {
        next(CustomErrorHandler.unAuthorized('Invalid Refresh Token'))
      }

      let userId
      try {
        const { _id } = await JwtService.verifyRefreshToken(refresh_token)

        userId = _id
      } catch (error) {
        return next(error)
      }

      const user = await User.findOne({
        _id: userId
      })

      if (!user) {
        return next(CustomErrorHandler.unAuthorized('User not found'))
      }

      user.fcm_tokens = [fcm_token]
      await user.save()

      // generate token
      const { access_token, refresh_token: new_refresh_token } =
        await JwtService.generateTokens(user)

      res.json({
        message: 'Token Refreshed',
        data: {
          access_token,
          refresh_token: new_refresh_token,
          fcm_token: user.fcm_tokens[0]
        }
      })
    } catch (error) {
      return next(error)
    }
  },
  async forgetPassword (req, res, next) {
    const { error } = await forgetPasswordValidation.validate(req.body)

    if (error) {
      return next(error)
    }

    try {
      const user = await User.findOne({
        phone: req.body.phone
      })

      await Otp.findOneAndDelete({
        phone: req.body.phone
      })

      if (!user) {
        return next(CustomErrorHandler.wrongCredentials())
      }

      // hash password

      const hashedPassword = await bcrypt.hash(req.body.password, 10)

      user.password = hashedPassword

      await user.save()

      res.status(200).json({
        status: 200,
        message: 'Password changed successfully'
      })
    } catch (err) {
      return next(err)
    }
  },
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
