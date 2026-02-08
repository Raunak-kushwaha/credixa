const { Usermodel } = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const bcrypt = require('bcryptjs');
const JWTService = require("../utils/JwtService");
const { check } = require("express-validator");
class AuthService{
    static async loginUser(body){
        const {email, password} = body
        const check_exist = await Usermodel.findOne({email: email})
        if (!check_exist){
            throw new ApiError(400, "User with this email does not exist")
        }
        const isMatch = await bcrypt.compare(password, check_exist.password)
        if (!isMatch){
            throw new ApiError(400, "Invalid password")
        }

        const token = JWTService.generateToken(check_exist._id)
        return {
            message: "Login successful",
            "token": token
        }
    }

    static async registerUser(body){
        const {name, email, password, ac_type} = body

        const check_exist = await Usermodel.findOne({email: email.toLowerCase()})
        if (check_exist){
            throw new ApiError(400, "User with this email already exists")
        }
    
            const user = await Usermodel.create({
                name,
                email,
                password,
                ac_type
            })
            const token = JWTService.generateToken(user._id)
            return {
                msg: "User registered successfully",
                "token": token
            }
}

    static async profileUser(user){
        const userd = await Usermodel.findById(user)
        .select("name email ac_type createdAt -_id")
        if (!userd){
            throw new ApiError(404, "User not found")
        }
        return userd
    }
    }
module.exports = AuthService