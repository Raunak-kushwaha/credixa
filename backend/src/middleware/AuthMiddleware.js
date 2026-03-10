const ApiError = require("../utils/ApiError")
const JWTService = require("../utils/JwtService")

// Stateless authentication middleware. No session data is stored on the
// server; the client must send a valid JWT with each request in the
// Authorization header. This allows multiple users/devices to log in
// concurrently and the server to be horizontally scalable.
const AuthMiddleware  = (req,res,next)=>{
    try {

        const headers = req.headers['authorization'] ||''
        if(!headers || !headers.startsWith("Bearer ")){
            throw new ApiError(401,"Please Login First")
        }

        const token = headers.split(" ")[1]
        if(!token){
            throw new ApiError(401,"Enter Valid Details")
        }

        const payload = JWTService.ValidateToken(token)
        req.user = payload.user
        req.role = payload.role
        next()


    } catch (error) {
        next(error)
    }
}
 
module.exports =AuthMiddleware