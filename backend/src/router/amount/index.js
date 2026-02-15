const express = require("express")
const ValidationMiddleware = require("../../middleware/ValidationMiddleware")
const AuthMiddleware = require("../../middleware/AuthMiddleware")
const AmountValidation = require("../../validations/AmountValidation")
const AmountController = require("../../controller/AmountController")
const router = express.Router()
 

router.post('/add-money',AuthMiddleware,AmountValidation.addMoney,ValidationMiddleware,AmountController.addMoney)

router.post('/payment/:txn_id', AmountController.verifyPayment)

router.post('/cancel-payment/:txn_id', AuthMiddleware, AmountController.cancelPayment)

router.get('/transactions', AuthMiddleware, AmountController.getAllTransactions);


module.exports = router