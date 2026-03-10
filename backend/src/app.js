const express = require('express')
const NotFoundError = require('./middleware/404Handling')
const ApiError = require('./utils/ApiError')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

// allow CORS from any origin (frontends running on local network)
// credentials true enables cookies if needed, origin true reflects request origin
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.static('public'));
app.use(express.json({}))
app.use(express.urlencoded({extended:false}))

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
