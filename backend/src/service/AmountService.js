// User.model exports "Usermodel" not "UserModel" – fix import
const { AccountModel } = require("../models/Account.model");
const { TransactionModel } = require("../models/Transactions.model");
const { Usermodel } = require("../models/User.model");
const { FixDepositModel } = require("../models/FixDeposit.model");
const ApiError = require("../utils/ApiError");
const { NewRazorpay } = require("../utils/Razorpay");
const crypto = require("crypto")
class AmountService{

    static async addMoney(body,user){
 

      const transaction=  await TransactionModel.create({
            account:body.account_no,
            user:user,
            amount:parseInt(body.amount),
            type:'credit'
        })

        const options = {
            amount: parseInt(body.amount)*100,
            currency: 'INR',
            receipt: transaction._id
        };
        const order = await NewRazorpay.orders.create(options)




        return {
           order_id:order.id,
           txn_id:transaction._id
        }
    }

    static async verifyPayment(body,txn_id){

        const {razorpay_order_id ,razorpay_payment_id ,razorpay_signature} =body


        const body_data = razorpay_order_id + "|" + razorpay_payment_id;


        const expect = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SCREATE || "")
        .update(body_data)
        .digest("hex");

        const isValid = expect === razorpay_signature;
        if(!isValid){
            return {
                url:`${process.env.FRONTEND_URI}/transactions?error=Transaction Failed`
            }
        }


        // update transaction and add amount in to account

       const transaction= await TransactionModel.findByIdAndUpdate(txn_id,{
            isSuccess:true,
            razorpayOrderId:razorpay_order_id,
            razorpayPaymentId:razorpay_payment_id,
            razorpaySignature:razorpay_signature,
             remark:'Transaction Success'
        })


     const account=    await AccountModel.findById(transaction.account)

        await AccountModel.findByIdAndUpdate(account._id,{
            amount:account.amount+transaction.amount
        })

        return {
            url:`${process.env.FRONTEND_URI}/transactions?success=Transaction Success`
        }
 
    }

static async getAllTransactions(user, filters = {}, page = 1, limit = 50){
        // Build dynamic query filter
        const query = { user };

        // Filter by transaction type (credit/debit)
        if (filters.type) {
            query.type = filters.type;
        }
        
        // Filter by start date
        if (filters.startDate) {
            if (!query.createdAt) query.createdAt = {};
            query.createdAt.$gte = new Date(filters.startDate);
        }
        
        // Filter by end date
        if (filters.endDate) {
            if (!query.createdAt) query.createdAt = {};
            query.createdAt.$lte = new Date(filters.endDate);
        }
        
        // Filter by minimum amount
        if (filters.minAmount) {
            const minAmt = parseFloat(filters.minAmount);
            if (!isNaN(minAmt)) {
                if (!query.amount) query.amount = {};
                query.amount.$gte = minAmt;
            }
        }
        
        // Filter by maximum amount
        if (filters.maxAmount) {
            const maxAmt = parseFloat(filters.maxAmount);
            if (!isNaN(maxAmt)) {
                if (!query.amount) query.amount = {};
                query.amount.$lte = maxAmt;
            }
        }

        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            TransactionModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("type remark createdAt amount isSuccess"),
            TransactionModel.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);
        return { data, total, page, limit, totalPages };
    }

    static async addNewAccount(user,body){
        
    const exist_user=  await Usermodel.findById(user)
      if(!exist_user){
        throw new ApiError(401,"User Not Found")
      }

      const ac=  await AccountModel.create({
            user,
            ac_type:body.ac_type,
            amount:0
        })

        await TransactionModel.create({
            account:ac._id,
            amount:0,
            remark:'New Account Opening',
            type:'credit',
            user:user,
            isSuccess:true
        })

        return {
            msg:"Account Created :)"
        }

    }

    static async transfer({ receiverEmail, amount }, userId){
        // cast amount to number
        const transferAmount = parseInt(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            throw new ApiError(400, "Invalid transfer amount");
        }

        const mongoose = require('mongoose');
        // Detect whether MongoDB deployment supports transactions (replica set or sharded)
        let usingTransaction = false;
        let session = null;
        try {
            const admin = mongoose.connection.db.admin();
            const info = await admin.command({ hello: 1 });
            // presence of setName means it's a replica set member
            if (info && info.setName) {
                session = await AccountModel.startSession();
                session.startTransaction();
                usingTransaction = true;
            } else {
                console.warn('AmountService.transfer: MongoDB is not a replica set member; using non-transactional fallback');
            }
        } catch (err) {
            // fallback to non-transactional flow
            usingTransaction = false;
            try { if (session) session.endSession(); } catch (e) {}
            console.warn('AmountService.transfer: transaction support check failed, falling back', err && err.message);
        }

        try {
            // sender info
            const senderId = userId;
            const senderUser = usingTransaction
                ? await Usermodel.findById(senderId).session(session)
                : await Usermodel.findById(senderId);
            if (!senderUser) {
                throw new ApiError(401, "Sender not found");
            }

            // prevent self transfer
            if (senderUser.email === receiverEmail) {
                throw new ApiError(400, "Cannot transfer to yourself");
            }

            // find receiver user
            const receiverUser = usingTransaction
                ? await Usermodel.findOne({ email: receiverEmail }).session(session)
                : await Usermodel.findOne({ email: receiverEmail });
            if (!receiverUser) {
                throw new ApiError(404, "Receiver not found");
            }
            if (!receiverUser.isApproved) {
                throw new ApiError(403, "Receiver account is not approved");
            }
            if (receiverUser.isFreezed) {
                throw new ApiError(403, "Receiver account is frozen");
            }

            // get sender and receiver accounts
            const senderAccount = usingTransaction
                ? await AccountModel.findOne({ user: senderId }).session(session)
                : await AccountModel.findOne({ user: senderId });
            if (!senderAccount) {
                throw new ApiError(400, "Sender account not found");
            }
            const receiverAccount = usingTransaction
                ? await AccountModel.findOne({ user: receiverUser._id }).session(session)
                : await AccountModel.findOne({ user: receiverUser._id });
            if (!receiverAccount) {
                throw new ApiError(400, "Receiver account not found");
            }
            // If we can use transactions, perform the safe transactional flow.
            if (usingTransaction) {
                // balance check
                if (senderAccount.amount < transferAmount) {
                    throw new ApiError(400, "Insufficient balance");
                }

                // perform updates
                senderAccount.amount -= transferAmount;
                receiverAccount.amount += transferAmount;

                await senderAccount.save({ session });
                await receiverAccount.save({ session });

                // create transaction records
                await TransactionModel.create([
                    {
                        account: senderAccount._id,
                        user: senderId,
                        amount: transferAmount,
                        type: 'debit',
                        isSuccess: true,
                        remark: `Transfer to ${receiverEmail}`
                    },
                    {
                        account: receiverAccount._id,
                        user: receiverUser._id,
                        amount: transferAmount,
                        type: 'credit',
                        isSuccess: true,
                        remark: `Transfer from ${senderUser.email}`
                    }
                ], { session });

                await session.commitTransaction();
                session.endSession();

                return {
                    msg: "Transfer successful",
                    amount: transferAmount,
                    receiverEmail
                };
            }

            // FALLBACK FLOW (no transactions available):
            // 1) Atomically decrement sender balance only if sufficient funds
            const updatedSender = await AccountModel.findOneAndUpdate(
                { user: senderId, amount: { $gte: transferAmount } },
                { $inc: { amount: -transferAmount } },
                { new: true }
            );

            if (!updatedSender) {
                throw new ApiError(400, "Insufficient balance");
            }

            // 2) Increment receiver balance
            const updatedReceiver = await AccountModel.findOneAndUpdate(
                { user: receiverUser._id },
                { $inc: { amount: transferAmount } },
                { new: true }
            );

            if (!updatedReceiver) {
                // rollback sender
                await AccountModel.findByIdAndUpdate(updatedSender._id, { $inc: { amount: transferAmount } });
                throw new ApiError(500, "Transfer failed while crediting receiver");
            }

            // 3) record transactions (non-transactional)
            await TransactionModel.create([
                {
                    account: updatedSender._id,
                    user: senderId,
                    amount: transferAmount,
                    type: 'debit',
                    isSuccess: true,
                    remark: `Transfer to ${receiverEmail}`
                },
                {
                    account: updatedReceiver._id,
                    user: receiverUser._id,
                    amount: transferAmount,
                    type: 'credit',
                    isSuccess: true,
                    remark: `Transfer from ${senderUser.email}`
                }
            ]);

            return {
                msg: "Transfer successful",
                amount: transferAmount,
                receiverEmail
            };
        } catch (error) {
            console.error('AmountService.transfer: error during transfer flow', {
                message: error.message,
                stack: error.stack
            });
            // If we were using transactions, abort; otherwise nothing to abort.
            try {
                if (usingTransaction) {
                    await session.abortTransaction();
                    session.endSession();
                }
            } catch (abortErr) {
                // ignore abort errors
            }

            throw error;
        }
    }

    static async getAnalytics(userId) {
        try {
            const mongoose = require('mongoose');
            // Monthly transactions aggregation
            const monthlyTransactions = await TransactionModel.aggregate([
                {
                    $match: {
                        user: new mongoose.Types.ObjectId(userId),
                        isSuccess: true,
                        type: { $in: ['credit', 'debit'] }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        total: { $sum: '$amount' }
                    }
                },
                {
                    $sort: { '_id.year': 1, '_id.month': 1 }
                },
                {
                    $project: {
                        _id: 0,
                        month: {
                            $concat: [
                                { $toString: '$_id.month' },
                                '/',
                                { $toString: '$_id.year' }
                            ]
                        },
                        total: 1
                    }
                }
            ]);

            // Credit vs Debit aggregation
            const creditVsDebit = await TransactionModel.aggregate([
                {
                    $match: {
                        user: new mongoose.Types.ObjectId(userId),
                        isSuccess: true,
                        type: { $in: ['credit', 'debit'] }
                    }
                },
                {
                    $group: {
                        _id: '$type',
                        total: { $sum: '$amount' }
                    }
                }
            ]);

            const creditVsDebitObj = {
                credit: 0,
                debit: 0
            };

            creditVsDebit.forEach(item => {
                if (item._id === 'credit') {
                    creditVsDebitObj.credit = item.total;
                } else if (item._id === 'debit') {
                    creditVsDebitObj.debit = item.total;
                }
            });

            // Total FD invested
            const fdData = await FixDepositModel.aggregate([
                {
                    $match: {
                        user: new mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalFDInvested: { $sum: '$amount' }
                    }
                }
            ]);

            const totalFDInvested = fdData.length > 0 ? fdData[0].totalFDInvested : 0;

            return {
                monthlyTransactions,
                creditVsDebit: creditVsDebitObj,
                totalFDInvested
            };
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw new ApiError(500, "Failed to fetch analytics");
        }
    }

}

module.exports = AmountService