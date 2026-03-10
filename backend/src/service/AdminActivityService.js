const { AdminActivityModel } = require("../models/AdminActivity.model");
const ApiError = require("../utils/ApiError");

class AdminActivityService {
    
    static async logActivity({ adminId, action, targetUser, description, metadata = {} }) {
        try {
            // Validate adminId
            if (!adminId) {
                console.error("Invalid adminId provided to logActivity");
                return null;
            }

            const activity = await AdminActivityModel.create({
                adminId,
                action,
                targetUser,
                description,
                metadata
            });

            return activity;
        } catch (error) {
            console.error("Error logging admin activity:", error.message);
            // Don't throw - just log the error to prevent breaking the main operation
            return null;
        }
    }

    static async getActivityLogs(page = 1, limit = 50) {
        try {
            const skip = (page - 1) * limit;
            const [logs, total] = await Promise.all([
                AdminActivityModel.find()
                    .populate('adminId', 'name email')
                    .populate('targetUser', 'name email')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                AdminActivityModel.countDocuments()
            ]);

            if (!logs) {
                throw new ApiError(404, "No activity logs found");
            }

            // Format logs for frontend
            const formattedLogs = logs.map(log => ({
                id: log._id.toString(),
                adminName: log.adminId?.name || 'Unknown Admin',
                action: log.action,
                targetUser: log.targetUser?.email || 'Unknown User',
                description: log.description,
                timestamp: log.createdAt,
                metadata: log.metadata
            }));

            const totalPages = Math.ceil(total / limit);

            return {
                msg: "Activity logs fetched successfully",
                count: total,
                logs: formattedLogs,
                page,
                limit,
                totalPages
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AdminActivityService;
