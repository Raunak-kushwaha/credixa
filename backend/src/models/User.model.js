const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: 
        {type: String,
        required: true,
        trim: true},
    email: 
        {type: String,
        required: true,
        unique: true,
        lower: true,
        trim: true},
    password: 
        {type: String, 
        required: true},
    ac_type: 
        {type: String, 
        required: true, 
        enum: ['saving', 'current'], 
        default: 'saving'}
}, 

{timestamps: true});

const model = mongoose.model('user', schema);

exports.Usermodel = model;