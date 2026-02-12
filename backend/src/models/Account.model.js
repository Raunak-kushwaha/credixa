const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'user',
                required:true
            },
            amount:{
                type:Number,
                default:0
            },
            

},{
    timestamps:true
})

const model = mongoose.model("account",Schema)

exports.AccountModel = model