const mongoose = require('mongoose')

exports.ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
  family: 4
})

        console.log("Database connected successfully with host:", mongoose.connection.host)
    }
    catch (error){
        mongoose.disconnect()
        console.error("Database connection failed", error.message)
    }

}