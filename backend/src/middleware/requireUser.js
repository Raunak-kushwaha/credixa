const ApiError = require("../utils/ApiError")

const requireUser = (req, res, next) => {
    try {
        if (req.role !== 'user') {
            throw new ApiError(403, "Users cannot access admin panel")
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = requireUser
