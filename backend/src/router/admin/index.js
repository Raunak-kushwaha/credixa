const express = require("express");
const AdminController = require("../../controller/AdminController");
const AuthMiddleware = require("../../middleware/AuthMiddleware");
const requireAdmin = require("../../middleware/AdminMiddleware");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(AuthMiddleware);
router.use(requireAdmin);

// Dashboard stats
router.route("/stats")
    .get(AdminController.getDashboardStats);

// Analytics
router.route("/analytics")
    .get(AdminController.getAnalytics);

// Users management
router.route("/users")
    .get(AdminController.getAllUsers);

// Pending users
router.route("/pending-users")
    .get(AdminController.getPendingUsers);

router.route("/pending-users/count")
    .get(AdminController.getPendingUsersCount);

// Approve user
router.route("/approve-user/:id")
    .patch(AdminController.approveUser);

// Reject user
router.route("/reject-user/:id")
    .patch(AdminController.rejectUser);

// Accounts management
router.route("/accounts")
    .get(AdminController.getAllAccounts);

// Transactions management
router.route("/transactions")
    .get(AdminController.getAllTransactions);

// Fixed Deposits management
router.route("/fixed-deposits")
    .get(AdminController.getAllFixDeposits);

// Freeze/Unfreeze user with path parameter
router.route("/user/:id/freeze")
    .patch(AdminController.freezeUser);

router.route("/user/:id/unfreeze")
    .patch(AdminController.unfreezeUser);

// Activity logs
router.route("/activity")
    .get(AdminController.getActivityLogs);

// User login activity
router.route("/login-activity")
    .get(AdminController.getUserLoginActivity);

// Global settings management
router.route("/settings")
    .get(AdminController.getSettings)
    .put(AdminController.updateSettings);

module.exports = router;
