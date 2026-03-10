const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['APPROVE_USER', 'REJECT_USER', 'FREEZE_ACCOUNT', 'UNFREEZE_ACCOUNT']
    },
    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true });

const model = mongoose.model('adminactivity', schema);

exports.AdminActivityModel = model;
