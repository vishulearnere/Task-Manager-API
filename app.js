require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

//Swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

// connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')

app.use(express.json())
// extra packages

app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
)
app.use(helmet())
app.use(cors())
app.use(xss())

const authRouter = require('./routes/auth')
const tasksRouter = require('./routes/tasks')

//
// routes
app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>')
})
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// routes
app.use('/api/v1/auth', authRouter)

app.use('/api/v1/tasks', authenticateUser, tasksRouter)

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()

// const express = require('express')
// const app = express()

// controllers
// --auth -> for login and creating user  [from this (login,dashboard) jwt token will be created and sent will be sent ]
// -- jobs -> for CRUD functinality in jobs[creating job, deleting etc.] of a particular user after authentication
//               [here after authentication by verifying token jwtverify]
// --  app.js -> auth -> jobs
//
//
//  middleware
// -- auth -> to authenticate user at every request of create,update,deleted,get job [to get id of a particular user]
//  -- error handler -> to handle the error since it accepts error parameter (error,req,res,next)
//

// routes
// -- auth.js -> to redirect login, register user
//   -- jobs.js -> to redirect create,delete,update,get functionality of job
//
//  models
//   -- jobs schema
//
//   --  user schema
//
//
//
//
//
//
//
//
//
