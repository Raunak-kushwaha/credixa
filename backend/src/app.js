const express = require('express')
const NotFoundError = require('./middleware/404Handling')
const ApiError = require('./utils/ApiError')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(morgan('dev'))

app.use("/api/v1", require('./router'))

app.get('/', (req, res) => {
  res.send({msg:'Hello World!'})
})
app.get('/', (req, res) => {
  res.send('API is running')
})
app.use("", (req, res, next) => {
    next(new ApiError(404, "not found") )
})
app.use(NotFoundError)
module.exports = app
