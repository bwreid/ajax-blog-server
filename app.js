const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const morgan = require('morgan')
require('./db/connection')
if (!process.env.NODE_ENV) app.use(morgan('dev'))

app.use(require('cors')())
app.disable('x-powered-by')
app.use(bodyParser.json())

const { PostsRouter } = require('./routes')
app.use('/posts', PostsRouter)

app.use((req, res, next) => {
  const status = 404
  const message = `Could not find route matching: ${req.method} ${req.path}`
  next({ status, message })
})

app.use((err, req, res, next) => {
  if (!process.env.NODE_ENV) console.log(err)
  const status = err.status || 500
  const message = err.message || 'Something went wrong!'
  res.status(status).json({ error: { message } })
})

const listener = () => `Listening on port ${port}!`
app.listen(port, listener)

module.exports = app
