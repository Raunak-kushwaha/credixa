const express = require("express")
const ValidationMiddleware = require("../../middleware/ValidationMiddleware")
const AuthMiddleware = require("../../middleware/AuthMiddleware")
const requireUser = require("../../middleware/requireUser")
const checkFrozenStatus = require("../../middleware/checkFrozenStatus")
const AmountValidation = require("../../validations/AmountValidation")
const AmountController = require("../../controller/AmountController")
const router = express.Router()
 

router.post('/add-money',AuthMiddleware,requireUser,checkFrozenStatus,AmountValidation.addMoney,ValidationMiddleware,AmountController.addMoney)

// transfer between users
router.post('/transfer',
    AuthMiddleware,
    requireUser,
    checkFrozenStatus,
    AmountValidation.transfer,
    ValidationMiddleware,
    AmountController.transfer
)

router.post('/payment/:txn_id', AmountController.verifyPayment)

router.post('/cancel-payment/:txn_id', AuthMiddleware,requireUser,checkFrozenStatus, AmountController.cancelPayment)

router.get('/transactions', AuthMiddleware,requireUser,checkFrozenStatus, AmountController.getAllTransactions);

router.get('/analytics', AuthMiddleware,requireUser, AmountController.getAnalytics);

module.exports = router