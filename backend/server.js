const{config}=require("dotenv")
config({
    path:'.env'
})


const app = require('./src/app')
const {ConnectDB} = require('./src/config/db.config')


const port = process.env.PORT || 8000
ConnectDB()
// bind to all network interfaces so the server is reachable from other devices
app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port} (0.0.0.0)`)
})
