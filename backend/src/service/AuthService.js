const { Usermodel } = require("../models/User.model");

class AuthService{
    static loginUser(body){
        return {msg:"User logged in"}
    }

    static async registerUser(body){
        const {name, email, password, ac_type} = body;
    
            await Usermodel.create({
                name,
                email,
                password,
                ac_type
            });
            return user
    
    
    
    }
}


module.exports = AuthService