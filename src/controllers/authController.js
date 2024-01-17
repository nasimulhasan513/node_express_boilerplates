import User from "../models/User";
import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtService from "../services/JwtService";
import authValidation from "../validation/authValidation";

const authController = {
  me: async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.user._id });
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }
      res.json(user);
    } catch (error) {
      return next(CustomErrorHandler.serverError(error));
    }
  },
  login: async (req, res, next) => {
    try {
      const { error } = authValidation.loginValidation(req.body);
      if (error) {
        return next(error);
      }

      const { phone } = req.body;

      const user = await User.findOne({ phone });
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }

      // generate token
      const access_token = JwtService.sign({
        _id: user._id,
      });

      res.json({
        message: "Login Successful",
        access_token,
        user: {
          _id: user._id,
          name: user.name,
          institute: user.institute,
          phone: user.phone,
        },
      });
    } catch (error) {
      return next(CustomErrorHandler.serverError(error));
    }
  },
  signup: async (req, res, next) => {
    try {
      const { error } = authValidation.signupValidation(req.body);
      if (error) {
        next(error);
      }
      const { name, institute, phone } = req.body;
      let user = await User.findOne({ phone });

      if (!user) {
        user = await User.create({
          name,
          institute,
          phone,
        });
      }

      const access_token = JwtService.sign({
        _id: user._id,
      });
      res.json({
        message: "Signup Successful",
        access_token,
        user: {
          _id: user._id,
          name: user.name,
          institute: user.institute,
          phone: user.phone,
        },
      });
    } catch (error) {
      return next(CustomErrorHandler.serverError(error));
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.user._id;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return CustomErrorHandler.notFound();
      }
      res.json({
        message: "Deleted Successfully",
      });
    } catch (error) {
      return CustomErrorHandler.serverError(error);
    }
  },
};

export default authController;
