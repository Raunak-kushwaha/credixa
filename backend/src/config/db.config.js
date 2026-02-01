const mongoose = require('mongoose')

exports.ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
  family: 4
})

        console.log("Database connected successfully")
    }
    catch (error){
        mongoose.disconnect()
        process.exit(1)
    }

}