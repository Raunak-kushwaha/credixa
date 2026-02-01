const { Usermodel } = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const bcrypt = require('bcryptjs')
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
        return {
            message: "Login successful",
            "token": "123"
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
            });
            return user
    
    
    
    }
}


module.exports = AuthService