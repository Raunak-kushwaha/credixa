const express = require("express")
const router= express.Router()
const AuthRoute = require("./auth")
const AmountRoute = require("./amount")

const routes =[{
    path:'/auth',
    route:AuthRoute
},{
    path:'/amount',
    route:AmountRoute
}]

routes.forEach((cur)=>{
    router.use(cur.path,cur.route)
})
module.exports = router