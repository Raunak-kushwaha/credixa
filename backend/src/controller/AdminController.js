const AdminService = require("../service/AdminService");

class AdminController {

    static async getAllUsers(req, res) {
        try {
            const { page, limit } = req.query;
            const p = page ? parseInt(page) : 1;
            const l = limit ? parseInt(limit) : 50;
            const res_obj = await AdminService.getAllUsers(p, l);
            res.status(200).send(res_obj);
        } catch (error) {
            throw error;
        }
    }

    static async getAllAccounts(req, res) {
        try {
            const { page, limit } = req.query;
            const p = page ? parseInt(page) : 1;
            const l = limit ? parseInt(limit) : 50;
            const res_obj = await AdminService.getAllAccounts(p, l);
            res.status(200).send(res_obj);
        } catch (error) {
            throw error;
        }
    }

    static async getAllTransactions(req, res) {
        try {
            const filters = {
                type: req.query.type,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                minAmount: req.query.minAmount,
                maxAmount: req.query.maxAmount
            };
            const { page, limit } = req.query;
            const p = page ? parseInt(page) : 1;
            const l = limit ? parseInt(limit) : 50;
            const res_obj = await AdminService.getAllTransactions(filters, p, l);
            res.status(200).send(res_obj);
        } catch (error) {
            throw error;
        }
    }

    static async getAllFixDeposits(req, res) {
        try {
            const { page, limit } = req.query;
            const p = page ? parseInt(page) : 1;
            const l = limit ? parseInt(limit) : 50;
            const res_obj = await AdminService.getAllFixDeposits(p, l);
            res.status(200).send(res_obj);
        } catch (error) {
            throw error;
        }
    }

    static async getAnalytics(req, res) {
        try {
            const res_obj = await AdminService.getAnalytics();
            res.status(200).send(res_obj);
        } catch (error) {
            throw error;
        }
    }

    static async getDashboardStats(req, res) {
        try {
            const res_obj = await AdminService.getDashboardStats();
            res.status(200).send(res_obj);
        } catch (error) {
            throw error;
        }
    }

    static async freezeUser(req, res) {
        try {
            const { id } = req.params;
            const adminId = req.user;
            const res_obj = await AdminService.freezeUser(id, adminId);
            res.status(200).send(res_obj);
        } catch (error) {
            throw error;
        }
    }

    static async unfreezeUser(req, res) {
        try {
            const { id } = req.params;
            const adminId = req.user;
            const res_obj = await AdminService.unfreezeUser(id, adminId);
            res.status(200).send(res_obj);
        } catch (error) {
            throw error;
        }
    }

    static async getPendingUsers(req, res) {
        try {
            const { page, limit } = req.query;
            const p = page ? parseInt(page) : 1;
            const l = limit ? parseInt(limit) : 50;
            const res_obj = await AdminService.getPendingUsers(p, l);
            res.status(200).send(res_obj);
        } catch (error) {
            throw error;
        }
    }
    static async getPendingUsersCount(req, res) {
    try {
        const res_obj = await AdminService.getPendingUsersCount();
        res.status(200).send(res_obj);
    } catch (error) {
        throw error;
    }
}

    static async approveUser(req, res) {
        try {
            const { id } = req.params;
            const adminId = req.user;
            const res_obj = await AdminService.approveUser(id, adminId);
            res.status(200).send(res_obj);
        } catch (error) {
            throw error;
        }
    }

    static async rejectUser(req, res) {
        try {
            const { id } = req.params;
            const adminId = req.user;
            const res_obj = await AdminService.rejectUser(id, adminId);
            res.status(200).send(res_obj);
        } catch (error) {
            throw error;
        }
    }

    static async getActivityLogs(req, res) {
        try {
            const { page, limit } = req.query;
            const p = page ? parseInt(page) : 1;
            const l = limit ? parseInt(limit) : 50;
            const res_obj = await AdminService.getActivityLogs(p, l);
            res.status(200).send(res_obj);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AdminController;
