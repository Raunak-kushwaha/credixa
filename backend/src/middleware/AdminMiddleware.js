const ApiError = require("../utils/ApiError")

const requireAdmin = (req, res, next) => {
    try {
        if (req.role !== 'admin') {
            throw new ApiError(403, "Users cannot access admin panel")
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = requireAdmin

