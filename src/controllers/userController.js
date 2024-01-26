import User from '../models/User'
import CustomErrorHandler from '../services/CustomErrorHandler'

const userController = {
  index: async (req, res, next) => {
    try {
      const users = await User.find(req.query).select('-password -updatedAt -__v')
      return res.json({
        message: 'All users',
        users
      })
    } catch (err) {
      return next(CustomErrorHandler.serverError(err.message))
    }
  }
}

export default userController
