const AmountService = require("../service/AmountService")

class AmountController{


    static addMoney = async(req,res)=>{
        const res_obj = await AmountService.addMoney(req.body,req.user)
        res.status(200).send(res_obj)
    }

    static verifyPayment = async(req,res)=>{
        try {
            const res_obj = await AmountService.verifyPayment(req.body,req.params.txn_id)
            res.redirect(res_obj.url)
        } catch(error) {
            console.error('Payment verification error in controller:', error);
            // Redirect to error page if verification fails
            res.redirect(`${process.env.FRONTEND_URI}/transactions?error=Payment Processing Failed`)
        }
    }

    static cancelPayment = async(req,res)=>{
        try {
            const res_obj = await AmountService.cancelPayment(req.params.txn_id)
            res.status(200).send(res_obj)
        } catch(error) {
            console.error('Cancel payment error in controller:', error);
            res.status(500).send({msg: 'Failed to cancel payment'})
        }
    }
    
    static getAllTransactions = async(req,res)=>{
        const filters = {
            type: req.query.type,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            minAmount: req.query.minAmount,
            maxAmount: req.query.maxAmount
        };
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 50;
        const res_obj = await AmountService.getAllTransactions(req.user, filters, page, limit)
        res.status(200).send(res_obj)
    }
    
    static addNewAccount = async(req,res)=>{
        const res_obj = await AmountService.addNewAccount(req.user,req.body)
        res.status(201).send(res_obj)
    }

    static transfer = async(req,res)=>{
        const res_obj = await AmountService.transfer(req.body, req.user)
        res.status(200).send(res_obj)
    }

    static getAnalytics = async(req,res)=>{
        try {
            const res_obj = await AmountService.getAnalytics(req.user)
            res.status(200).send(res_obj)
        } catch(error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).send({msg: error.message})
        }
    }

    
    
}

module.exports = AmountController