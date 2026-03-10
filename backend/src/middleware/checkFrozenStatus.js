const ApiError = require("../utils/ApiError");
const { Usermodel } = require("../models/User.model");

const checkFrozenStatus = async (req, res, next) => {
  try {
    const userId = req.user; // From AuthMiddleware
    
    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const user = await Usermodel.findById(userId);
    
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if user account is frozen
    if (user.isFreezed) {
      throw new ApiError(403, "Account is frozen");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkFrozenStatus;
