const { Usermodel } = require("../models/User.model");
const { AccountModel } = require("../models/Account.model");
const { TransactionModel } = require("../models/Transactions.model");
const { FixDepositModel } = require("../models/FixDeposit.model");
const ApiError = require("../utils/ApiError");
const AdminActivityService = require("./AdminActivityService");

class AdminService {
    
    static async getAllUsers(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            Usermodel.find()
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Usermodel.countDocuments()
        ]);
        
        if (!users) {
            throw new ApiError(404, "No users found");
        }
        
        const totalPages = Math.ceil(total / limit);
        return {
            msg: "Users fetched successfully",
            count: total,
            users: users,
            page,
            limit,
            totalPages
        };
    }

    static async getAllAccounts(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [accounts, total] = await Promise.all([
            AccountModel.find()
                .populate('user', 'name email role')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            AccountModel.countDocuments()
        ]);
        
        if (!accounts) {
            throw new ApiError(404, "No accounts found");
        }
        
        const totalPages = Math.ceil(total / limit);
        return {
            msg: "Accounts fetched successfully",
            count: total,
            accounts: accounts,
            page,
            limit,
            totalPages
        };
    }

    static async getAllTransactions(filters = {}, page = 1, limit = 50) {
        // Build dynamic query filter
        const query = {};

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
        const [transactions, total] = await Promise.all([
            TransactionModel.find(query)
                .populate('user', 'name email')
                .populate('account')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            TransactionModel.countDocuments(query)
        ]);
        
        if (!transactions) {
            throw new ApiError(404, "No transactions found");
        }
        
        const totalPages = Math.ceil(total / limit);
        return {
            msg: "Transactions fetched successfully",
            count: total,
            transactions: transactions,
            page,
            limit,
            totalPages
        };
    }

    static async getAllFixDeposits(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [fixDeposits, total] = await Promise.all([
            FixDepositModel.find()
                .populate('user', 'name email')
                .populate('account')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            FixDepositModel.countDocuments()
        ]);
        
        if (!fixDeposits) {
            throw new ApiError(404, "No fixed deposits found");
        }
        
        const totalPages = Math.ceil(total / limit);
        return {
            msg: "Fixed deposits fetched successfully",
            count: total,
            fixDeposits: fixDeposits,
            page,
            limit,
            totalPages
        };
    }

    static async getAnalytics(adminId) {
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1);
        const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const start30Days = new Date(endOfDay);
        start30Days.setDate(start30Days.getDate() - 29);
        start30Days.setHours(0, 0, 0, 0);

        const adminDoc = adminId ? await Usermodel.findById(adminId).select("lastLoginAt lastLoginIp") : null;

        const [
            totalUsers,
            totalAccounts,
            totalTransactions,
            totalFDs,
            balanceResult,
            monthlyTxResult,
            userGrowthResult,
            dailyTxResult,
            dailyUserGrowthResult,
            transactionTypesResult,
            moneyFlowResult
        ] = await Promise.all([
            Usermodel.countDocuments(),
            AccountModel.countDocuments(),
            TransactionModel.countDocuments(),
            FixDepositModel.countDocuments(),
            AccountModel.aggregate([
                { $group: { _id: null, total: { $sum: "$amount" } } },
                { $project: { _id: 0, total: 1 } }
            ]),
            TransactionModel.aggregate([
                { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
                { $group: { _id: { $month: "$createdAt" }, total: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            Usermodel.aggregate([
                { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
                { $group: { _id: { $month: "$createdAt" }, total: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            TransactionModel.aggregate([
                { $match: { createdAt: { $gte: start30Days, $lte: endOfDay } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        total: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            Usermodel.aggregate([
                { $match: { createdAt: { $gte: start30Days, $lte: endOfDay } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        total: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            TransactionModel.aggregate([
                { $group: { _id: "$type", count: { $sum: 1 } } }
            ]),
            TransactionModel.aggregate([
                {
                    $group: {
                        _id: "$type",
                        total: { $sum: "$amount" }
                    }
                }
            ])
        ]);

        const totalMoneyInSystem = balanceResult[0]?.total ?? 0;

        const activity = {
            lastLoginAt: adminDoc?.lastLoginAt || null,
            lastLoginIp: adminDoc?.lastLoginIp || ""
        };

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthMap = (arr) => {
            const byMonth = Object.fromEntries(arr.map(({ _id, total }) => [_id, total]));
            return monthNames.map((month, i) => ({
                month,
                total: byMonth[i + 1] ?? 0
            }));
        };

        const monthlyTransactions = monthMap(monthlyTxResult);
        const userGrowth = monthMap(userGrowthResult);
        const dailyTransactions = dailyTxResult.map(({ _id, total }) => {
            const d = new Date(`${_id}T00:00:00.000Z`);
            return {
                day: d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
                total
            };
        });
        const dailyUserGrowth = dailyUserGrowthResult.map(({ _id, total }) => {
            const d = new Date(`${_id}T00:00:00.000Z`);
            return {
                day: d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
                total
            };
        });
        const transactionTypes = transactionTypesResult.map(({ _id, count }) => ({
            type: _id,
            count
        }));

        const moneyFlowByType = Object.fromEntries(
            moneyFlowResult.map(({ _id, total }) => [_id, total])
        );
        const moneyFlow = {
            incoming: moneyFlowByType.credit ?? 0,
            outgoing: (moneyFlowByType.debit ?? 0) + (moneyFlowByType.fix_deposit ?? 0)
        };

        return {
            stats: {
                totalUsers,
                totalAccounts,
                totalTransactions,
                totalFDs,
                totalMoneyInSystem
            },
            charts: {
                monthlyTransactions,
                userGrowth,
                dailyTransactions,
                dailyUserGrowth,
                transactionTypes,
                moneyFlow
            },
            activity
        };
    }

    static async getDashboardStats() {
        const userCount = await Usermodel.countDocuments();
        const accountCount = await AccountModel.countDocuments();
        const transactionCount = await TransactionModel.countDocuments();
        const fixDepositCount = await FixDepositModel.countDocuments();

        const totalAmount = await AccountModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        return {
            msg: "Dashboard stats fetched successfully",
            stats: {
                totalUsers: userCount,
                totalAccounts: accountCount,
                totalTransactions: transactionCount,
                totalFixDeposits: fixDepositCount,
                totalAmount: totalAmount[0]?.total || 0
            }
        };
    }

    static async getUserLoginActivity(limit = 50) {
        const size = Number.isNaN(Number(limit)) ? 50 : Math.min(Number(limit), 200);
        const users = await Usermodel.find({
            role: "user",
            lastLoginAt: { $ne: null }
        })
            .select("name email lastLoginAt lastLoginIp isApproved isFreezed")
            .sort({ lastLoginAt: -1 })
            .limit(size);

        return {
            count: users.length,
            users
        };
    }

    static async freezeUser(userId, adminId) {
        const user = await Usermodel.findByIdAndUpdate(
            userId,
            { isFreezed: true },
            { new: true }
        ).select("-password");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Log the activity
        await AdminActivityService.logActivity({
            adminId,
            action: 'FREEZE_ACCOUNT',
            targetUser: userId,
            description: `Froze account for user ${user.name}`,
            metadata: { userName: user.name, userEmail: user.email }
        });

        return {
            msg: "User frozen successfully",
            user: user
        };
    }

    static async unfreezeUser(userId, adminId) {
        const user = await Usermodel.findByIdAndUpdate(
            userId,
            { isFreezed: false },
            { new: true }
        ).select("-password");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Log the activity
        await AdminActivityService.logActivity({
            adminId,
            action: 'UNFREEZE_ACCOUNT',
            targetUser: userId,
            description: `Unfroze account for user ${user.name}`,
            metadata: { userName: user.name, userEmail: user.email }
        });

        return {
            msg: "User unfrozen successfully",
            user: user
        };
    }

    static async getPendingUsers(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const query = { isApproved: false, role: 'user' };

        const [pendingUsers, total] = await Promise.all([
            Usermodel.find(query)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Usermodel.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);
        return {
            msg: "Pending users fetched successfully",
            count: total,
            users: pendingUsers,
            page,
            limit,
            totalPages
        };
    }
    static async getPendingUsersCount() {
    const count = await Usermodel.countDocuments({
        isApproved: false,
        role: "user"
    });

    return {
        msg: "Pending users count fetched successfully",
        count
    };
}

    static async approveUser(userId, adminId) {
        const user = await Usermodel.findByIdAndUpdate(
            userId,
            { isApproved: true },
            { new: true }
        ).select("-password");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Log the activity
        await AdminActivityService.logActivity({
            adminId,
            action: 'APPROVE_USER',
            targetUser: userId,
            description: `Approved user registration for ${user.name}`,
            metadata: { userName: user.name, userEmail: user.email }
        });

        return {
            msg: "User approved successfully",
            user: user
        };
    }

    static async rejectUser(userId, adminId) {
        const user = await Usermodel.findByIdAndDelete(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Log the activity
        await AdminActivityService.logActivity({
            adminId,
            action: 'REJECT_USER',
            targetUser: userId,
            description: `Rejected and deleted user registration for ${user.name}`,
            metadata: { userName: user.name, userEmail: user.email }
        });

        return {
            msg: "User rejected and deleted successfully",
            user: user
        };
    }

    static async getActivityLogs(page = 1, limit = 50) {
        return await AdminActivityService.getActivityLogs(page, limit);
    }
}

module.exports = AdminService;
