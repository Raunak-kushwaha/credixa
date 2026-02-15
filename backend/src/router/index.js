const express = require("express")
const router= express.Router()
const AuthRoute = require("./auth")
const AmountRoute = require("./amount")
const FdRoute = require("./fd");

const routes =[{
    path:'/auth',
    route:AuthRoute
},{
    path:'/amount',
    route:AmountRoute
},{ path: "/fd", 
    route: FdRoute }
]

routes.forEach((cur)=>{
    router.use(cur.path,cur.route)
})
module.exports = router