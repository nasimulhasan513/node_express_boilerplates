import JwtService from '../services/JwtService'
import CustomErrorHandler from '../services/CustomErrorHandler'
import User from '../models/User'

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return next(CustomErrorHandler.unAuthorized())
  }

  const token = authHeader.split(' ')[1]

  try {
    const { _id } = await JwtService.verify(token)

    req.user = {
      _id
    }

    const user = await User.findOne({ _id: req.user._id })
    if (!user) {
      return next(CustomErrorHandler.unAuthorized())
    }
    next()
  } catch (err) {
    return next(CustomErrorHandler.unAuthorized())
  }
}

export default auth
