const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    tiers: {
        saving: {
            dailyTransferLimit: { type: Number, default: 20000 },
            transferFeePercent: { type: Number, default: 2.0 }, // 2%
            fdInterestRate: { type: Number, default: 5.5 }
        },
        current: {
            dailyTransferLimit: { type: Number, default: 100000 },
            transferFeePercent: { type: Number, default: 0.5 }, // 0.5%
            fdInterestRate: { type: Number, default: 6.5 }
        }
    }
}, { timestamps: true });

const model = mongoose.model('settings', schema);

exports.SettingsModel = model;
