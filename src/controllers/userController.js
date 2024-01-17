import User from "../models/User";
import CustomErrorHandler from "../services/CustomErrorHandler";

const userController = {
  index: async (req, res, next) => {
    const user = req.user._id;

    const allowedUsers = [
      "658293b4d435de4543db00a8",
      "658296d8039df33d6fe01cfc",
      "6582a513a4292f52b9cdf2a8",
      "65833eb982f2521727628e51",
    ];

    if (!allowedUsers.includes(user)) {
      return next(CustomErrorHandler.notFound());
    }

    try {
      const {
        limit = 2,
        page = 1,
        sortkey = "mediplanner23_progress",
        project = "mediplan23",
      } = req.query;

      const filters = {
        [project]: true,
      };

      if (req.query.search) {
        // name phone or institute search
        filters.$or = [
          { name: { $regex: req.query.search, $options: "i" } },
          { phone: { $regex: req.query.search, $options: "i" } },
          { institute: { $regex: req.query.search, $options: "i" } },
        ];
      }

      const users = await User.paginate(
        {
          ...filters,
        },
        {
          limit,
          page,
          sort: {
            [sortkey]: -1,
          },
        }
      );
      res.json(users);
    } catch (error) {
      return next(CustomErrorHandler.serverError(error));
    }
  },
  stats: async (req, res, next) => {
    const user = req.user._id;

    const allowedUsers = [
      "658293b4d435de4543db00a8",
      "658296d8039df33d6fe01cfc",
      "6582a513a4292f52b9cdf2a8",
      "65833eb982f2521727628e51",
    ];

    if (!allowedUsers.includes(user)) {
      return next(CustomErrorHandler.notFound());
    }

    // users stats by createdAt Date
    const start = new Date(req.query.start).getTime();
    const end = new Date(req.query.end).getTime();

    try {
      const data = await User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: start,
              $lt: end,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            total: { $sum: 1 },
          },
        },
      ]);

      res.json(data);
    } catch (error) {
      return next(CustomErrorHandler.serverError(error));
    }
  },

  async update(req, res, next) {
    const user = req.user._id;

    const allowedUsers = [
      "658293b4d435de4543db00a8",
      "658296d8039df33d6fe01cfc",
      "6582a513a4292f52b9cdf2a8",
      "65833eb982f2521727628e51",
    ];

    if (!allowedUsers.includes(user)) {
      return next(CustomErrorHandler.notFound());
    }

    try {
      const { property, value } = req.body;

      // update all users with property and value
      const users = await User.updateMany({}, { [property]: value });

      res.json({
        message: "Updated",
        users: users,
      });
    } catch (error) {
      return next(CustomErrorHandler.serverError(error));
    }
  },
};

export default userController;
