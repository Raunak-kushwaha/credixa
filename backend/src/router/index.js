const express = require("express")
const router= express.Router()
const AuthRoute = require("./auth")
const AmountRoute = require("./amount")
const FdRoute = require("./fd");
const AdminRoute = require("./admin");

const routes =[{
    path:'/auth',
    route:AuthRoute
},{
    path:'/amount',
    route:AmountRoute
},{ path: "/fd", 
    route: FdRoute
},{
    path: "/admin",
    route: AdminRoute
}
]

routes.forEach((cur)=>{
    router.use(cur.path,cur.route)
})
module.exports = router