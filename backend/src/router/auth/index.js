const express = require("express")
const AuthController = require("../../controller/AuthController")
const AuthValidation = require("../../validations/AuthValidation")
const ValidationMiddleware = require("../../middleware/ValidationMiddleware")
const AuthMiddleware = require("../../middleware/AuthMiddleware")
const router = express.Router()

router.route("/login")
.post(AuthValidation.loginUser,ValidationMiddleware,AuthController.loginUser)



router.route("/register")
.post(AuthValidation.registerUser,ValidationMiddleware,AuthController.registerUser)


router.route("/profile")
.get(AuthMiddleware,AuthController.profileUser)
.put(AuthMiddleware,AuthController.updateProfile)

router.route("/change-password")
.put(AuthMiddleware,AuthController.changePassword)

router.route("/settings")
.get(AuthMiddleware,AuthController.getSettings)

module.exports = router