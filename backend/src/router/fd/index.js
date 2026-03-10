const express = require("express")
const AuthMiddleware = require("../../middleware/AuthMiddleware")
const requireUser = require("../../middleware/requireUser")
const checkFrozenStatus = require("../../middleware/checkFrozenStatus")
const FixDepositValidation = require("../../validations/FixDepositValidation")
const ValidationMiddleware = require("../../middleware/ValidationMiddleware")
const FixDepositController = require("../../controller/FixDepositController")
const router = express.Router()

router.route('/add-new')
.post(AuthMiddleware,requireUser,checkFrozenStatus,FixDepositValidation.AddNewFD,ValidationMiddleware,FixDepositController.AddNewFD)

router.route('/get-all')
.get(AuthMiddleware,requireUser,checkFrozenStatus,FixDepositController.getAllFD)


router.route('/get/:id')
.get(FixDepositValidation.FD_id,ValidationMiddleware,AuthMiddleware,requireUser,checkFrozenStatus,FixDepositController.getFDById)



router.route('/claim/:id')
.get(FixDepositValidation.FD_id,ValidationMiddleware,AuthMiddleware,requireUser,checkFrozenStatus,FixDepositController.ClaimFDById)




module.exports = router